'use client'

import { Suspense, useId, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { PageHero } from '@/components/ui/PageHero'
import { ModelCard } from '@/components/ui/ModelCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { ArrowRight, Search, X } from '@/components/ui/Icon'
import { useMessages } from '@/lib/i18n/LanguageContext'
import { modelsMessages } from './messages'
import { BRAND_ORDER, BRANDS, isBrand } from '@/lib/site'
import { cn, formatPrice } from '@/lib/utils'
import type { Brand, Image, ModelCard as ModelCardData } from '@/lib/sanity/types'

type Props = { models: ModelCardData[]; heroImage: Image | null }
type Sort = 'featured' | 'name' | 'priceAsc' | 'priceDesc'

const SORTS: Sort[] = ['featured', 'name', 'priceAsc', 'priceDesc']
const MAX_COMPARE = 3
const PRICE_STEP = 50

function isSort(value: string): value is Sort {
  return (SORTS as string[]).includes(value)
}

function byPrice(direction: 1 | -1) {
  return (a: ModelCardData, b: ModelCardData) => {
    if (a.price == null) return b.price == null ? 0 : 1
    if (b.price == null) return -1
    return (a.price - b.price) * direction
  }
}

export function ModelsView({ models, heroImage }: Props) {
  const m = useMessages(modelsMessages)

  return (
    <div className="min-h-screen bg-black">
      <PageHero eyebrow={m.hero.eyebrow} title={m.hero.title} subtitle={m.hero.subtitle} image={heroImage} />
      <Suspense fallback={<Catalogue models={models} brand={null} />}>
        <CatalogueFromUrl models={models} />
      </Suspense>
    </div>
  )
}

function CatalogueFromUrl({ models }: { models: ModelCardData[] }) {
  const brand = useSearchParams().get('brand')
  return <Catalogue models={models} brand={isBrand(brand) ? brand : null} />
}

function setBrandInUrl(brand: Brand | null) {
  const params = new URLSearchParams(window.location.search)
  if (brand) params.set('brand', brand)
  else params.delete('brand')
  const query = params.toString()
  window.history.replaceState(null, '', query ? `${window.location.pathname}?${query}` : window.location.pathname)
}

function Catalogue({ models, brand }: { models: ModelCardData[]; brand: Brand | null }) {
  const m = useMessages(modelsMessages)
  const ids = useId()

  const prices = useMemo(() => models.flatMap((model) => (model.price != null ? [model.price] : [])), [models])
  const priceFloor = prices.length ? Math.floor(Math.min(...prices) / PRICE_STEP) * PRICE_STEP : 0
  const priceCeiling = prices.length ? Math.ceil(Math.max(...prices) / PRICE_STEP) * PRICE_STEP : 0
  const showPriceFilter = prices.length > 1 && priceCeiling > priceFloor

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<Sort>('featured')
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [compare, setCompare] = useState<string[]>([])
  const [limitHit, setLimitHit] = useState(false)

  const brandCounts = useMemo(() => {
    const counts: Partial<Record<Brand, number>> = {}
    for (const model of models) counts[model.brand] = (counts[model.brand] ?? 0) + 1
    return counts
  }, [models])
  const brands = BRAND_ORDER.filter((b) => brandCounts[b] || b === brand)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    const list = models.filter((model) => {
      if (brand && model.brand !== brand) return false
      if (term && !model.name.toLowerCase().includes(term)) return false
      if (maxPrice != null && model.price != null && model.price > maxPrice) return false
      return true
    })
    if (sort === 'name') return [...list].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'priceAsc') return [...list].sort(byPrice(1))
    if (sort === 'priceDesc') return [...list].sort(byPrice(-1))
    return list
  }, [models, brand, search, maxPrice, sort])

  const hasFilters = brand !== null || search.trim() !== '' || maxPrice != null
  const clearFilters = () => {
    setSearch('')
    setMaxPrice(null)
    setBrandInUrl(null)
  }

  const toggleCompare = (slug: string) => {
    if (compare.includes(slug)) {
      setCompare(compare.filter((s) => s !== slug))
      setLimitHit(false)
    } else if (compare.length >= MAX_COMPARE) {
      setLimitHit(true)
    } else {
      setCompare([...compare, slug])
    }
  }

  const compared = compare.flatMap((slug) => models.filter((model) => model.slug === slug))

  if (models.length === 0) {
    return (
      <div className="container py-16">
        <EmptyState title={m.empty.title} description={m.empty.description} action={{ label: m.empty.action, href: '/contact' }} />
      </div>
    )
  }

  return (
    <>
      <div className="border-b border-dark-3 bg-dark">
        <div className="container">
          <div role="group" aria-label={m.filters.brand} className="flex flex-wrap gap-2 py-4">
            {[null, ...brands].map((b) => {
              const active = brand === b
              return (
                <button
                  key={b ?? 'all'}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setBrandInUrl(b)}
                  className={cn(
                    'min-h-10 px-4 text-xs font-semibold uppercase tracking-wider transition-colors',
                    active ? 'bg-red text-white' : 'text-light hover:bg-dark-3 hover:text-off-white',
                  )}
                >
                  {b ? BRANDS[b] : m.filters.allBrands}
                  {b ? <span className={cn('ml-2', active ? 'text-white/70' : 'text-mid')}>{brandCounts[b] ?? 0}</span> : null}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className={cn('container py-10', compare.length > 0 && 'pb-48 md:pb-36')}>
        <section aria-labelledby={`${ids}-filters`} className="mb-8 border border-dark-3 bg-dark p-5">
          <h2 id={`${ids}-filters`} className="sr-only">
            {m.filters.title}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_14rem]">
            <div>
              <label htmlFor={`${ids}-search`} className="label">
                {m.filters.search}
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mid" />
                <input
                  id={`${ids}-search`}
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={m.filters.searchPlaceholder}
                  className="input pl-10"
                  autoComplete="off"
                />
              </div>
            </div>

            {showPriceFilter ? (
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <label htmlFor={`${ids}-price`} className="label">
                    {m.filters.maxPrice}
                  </label>
                  <output htmlFor={`${ids}-price`} className="text-sm font-semibold text-gold">
                    {maxPrice == null ? m.filters.anyPrice : formatPrice(maxPrice)}
                  </output>
                </div>
                <input
                  id={`${ids}-price`}
                  type="range"
                  min={priceFloor}
                  max={priceCeiling}
                  step={PRICE_STEP}
                  value={maxPrice ?? priceCeiling}
                  aria-valuetext={maxPrice == null ? m.filters.anyPrice : formatPrice(maxPrice)}
                  aria-describedby={`${ids}-price-note`}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    setMaxPrice(value >= priceCeiling ? null : value)
                  }}
                  className="h-10 w-full accent-red"
                />
                <p id={`${ids}-price-note`} className="text-xs text-mid">
                  {m.filters.unpricedNote}
                </p>
              </div>
            ) : null}

            <div>
              <label htmlFor={`${ids}-sort`} className="label">
                {m.filters.sort}
              </label>
              <select
                id={`${ids}-sort`}
                value={sort}
                onChange={(e) => isSort(e.target.value) && setSort(e.target.value)}
                className="select"
              >
                {SORTS.map((value) => (
                  <option key={value} value={value}>
                    {m.filters.sortOptions[value]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex min-h-10 flex-wrap items-center justify-between gap-3 border-t border-dark-3 pt-4">
            <p role="status" className="text-sm text-light">
              <span className="font-bold text-off-white">{m.filters.results(filtered.length)}</span>
            </p>
            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex min-h-10 items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red hover:text-red-light"
              >
                <X className="h-3.5 w-3.5" /> {m.filters.clear}
              </button>
            ) : null}
          </div>
        </section>

        {filtered.length > 0 ? (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((model, i) => (
              <li key={model._id}>
                <ModelCard
                  model={model}
                  index={i}
                  compare={{
                    selected: compare.includes(model.slug),
                    onToggle: () => toggleCompare(model.slug),
                    label: m.compare.toggle,
                  }}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="border border-dark-3 bg-dark px-6 py-16 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center border border-dark-3 bg-dark-2">
              <Search className="h-6 w-6 text-red" />
            </div>
            <h2 className="mb-3 font-display text-3xl leading-none text-off-white">{m.noResults.title}</h2>
            <p className="mx-auto mb-8 max-w-md leading-relaxed text-light">{m.noResults.description}</p>
            <button type="button" onClick={clearFilters} className="btn-primary">
              {m.filters.clear}
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {compare.length > 0 ? (
          <motion.aside
            key="compare-bar"
            aria-label={m.compare.bar}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-red bg-dark-2 shadow-red-lg"
          >
            <div className="container flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-light">
                  {m.compare.bar} · {m.compare.count(compare.length)}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {compared.map((model) => (
                    <li key={model.slug} className="flex items-center bg-dark-3 pl-3">
                      <span className="max-w-[9rem] truncate text-sm font-medium text-off-white">{model.name}</span>
                      <button
                        type="button"
                        onClick={() => toggleCompare(model.slug)}
                        aria-label={m.compare.remove(model.name)}
                        className="flex h-10 w-10 items-center justify-center text-mid transition-colors hover:text-red"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
                <p aria-live="polite" className="mt-1 text-xs text-amber-400">
                  {limitHit ? m.compare.limit : ''}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCompare([])
                    setLimitHit(false)
                  }}
                  className="btn-ghost text-xs"
                >
                  {m.compare.clear}
                </button>
                {compare.length >= 2 ? (
                  <Link href={`/compare?ids=${compare.join(',')}`} className="btn-primary flex-1 justify-center text-xs md:flex-none">
                    {m.compare.go} <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <p className="flex-1 text-xs text-mid md:flex-none">{m.compare.needTwo}</p>
                )}
              </div>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  )
}
