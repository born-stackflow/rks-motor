'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { EmptyState } from '@/components/ui/EmptyState'
import { Search, Wrench, X } from '@/components/ui/Icon'
import { PageHero } from '@/components/ui/PageHero'
import { PartCard } from '@/components/ui/PartCard'
import { useLanguage, useMessages } from '@/lib/i18n/LanguageContext'
import { partsMessages } from './messages'
import { isPartCategory, PART_AVAILABILITY, PART_CATEGORIES, PART_TYPES } from '@/lib/site'
import type { Image, PartAvailability, PartCard as PartCardData, PartCategory } from '@/lib/sanity/types'
import { cn } from '@/lib/utils'
import { PART_ENQUIRY_ID, PartEnquirySection } from './PartEnquirySection'

type PartType = PartCardData['partType']

type Props = {
  parts: PartCardData[]
  background?: Image | null
  models: string[]
}

const CATEGORY_KEYS = Object.keys(PART_CATEGORIES) as PartCategory[]
const TYPE_KEYS = Object.keys(PART_TYPES) as PartType[]
const AVAILABILITY_KEYS = Object.keys(PART_AVAILABILITY) as PartAvailability[]

const compact = (value: string) => value.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')

/** Reads the category from `?category=` so links from the home page and the header land on a filtered list. */
export function PartsCatalogue(props: Props) {
  const value = useSearchParams().get('category')
  return <PartsCatalogueView {...props} category={isPartCategory(value) ? value : null} />
}

export function PartsCatalogueView({ parts, background, models, category }: Props & { category: PartCategory | null }) {
  const { locale } = useLanguage()
  const m = useMessages(partsMessages).list
  const router = useRouter()

  const [query, setQuery] = useState('')
  const [type, setType] = useState<PartType | ''>('')
  const [availability, setAvailability] = useState<PartAvailability | ''>('')

  const counts = useMemo(() => {
    const result = new Map<PartCategory, number>()
    for (const part of parts) result.set(part.category, (result.get(part.category) ?? 0) + 1)
    return result
  }, [parts])

  const categories = CATEGORY_KEYS.filter((key) => counts.has(key) || key === category)

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase()
    const code = compact(query)
    return parts.filter((part) => {
      if (category && part.category !== category) return false
      if (type && part.partType !== type) return false
      if (availability && part.availability !== availability) return false
      if (!text) return true
      return part.name.toLowerCase().includes(text) || (!!code && compact(part.partNumber ?? '').includes(code))
    })
  }, [parts, category, type, availability, query])

  const hasFilters = !!(category || type || availability || query.trim())

  function resetFilters() {
    setQuery('')
    setType('')
    setAvailability('')
    if (category) router.replace('/parts', { scroll: false })
  }

  return (
    <>
      <PageHero eyebrow={m.eyebrow} title={m.title} subtitle={m.subtitle} image={background} />

      {parts.length === 0 ? (
        <div className="section-sm bg-black">
          <div className="container max-w-3xl">
            <EmptyState
              icon={Wrench}
              title={m.emptyTitle}
              description={m.emptyText}
              action={{ label: m.emptyAction, href: `#${PART_ENQUIRY_ID}` }}
            />
          </div>
        </div>
      ) : (
        <div className="section-sm bg-black">
          <div className="container">
            <nav aria-label={m.categoriesLabel} className="mb-8">
              <ul className="flex flex-wrap gap-2">
                <li>
                  <CategoryLink href="/parts" active={!category} label={m.allCategories} count={parts.length} />
                </li>
                {categories.map((key) => (
                  <li key={key}>
                    <CategoryLink
                      href={`/parts?category=${key}`}
                      active={category === key}
                      label={PART_CATEGORIES[key][locale]}
                      count={counts.get(key) ?? 0}
                    />
                  </li>
                ))}
              </ul>
            </nav>

            <div className="grid gap-4 border border-dark-3 bg-dark p-4 sm:p-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
              <div>
                <label htmlFor="parts-search" className="label">
                  {m.searchLabel}
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mid" />
                  <input
                    id="parts-search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={m.searchPlaceholder}
                    className="input pl-11"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="parts-type" className="label">
                  {m.typeLabel}
                </label>
                <select
                  id="parts-type"
                  value={type}
                  onChange={(event) => setType(TYPE_KEYS.find((key) => key === event.target.value) ?? '')}
                  className="select"
                >
                  <option value="">{m.allTypes}</option>
                  {TYPE_KEYS.map((key) => (
                    <option key={key} value={key}>
                      {PART_TYPES[key][locale]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="parts-availability" className="label">
                  {m.availabilityLabel}
                </label>
                <select
                  id="parts-availability"
                  value={availability}
                  onChange={(event) => setAvailability(AVAILABILITY_KEYS.find((key) => key === event.target.value) ?? '')}
                  className="select"
                >
                  <option value="">{m.anyAvailability}</option>
                  {AVAILABILITY_KEYS.map((key) => (
                    <option key={key} value={key}>
                      {PART_AVAILABILITY[key].label[locale]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 mb-6 flex min-h-10 flex-wrap items-center justify-between gap-3">
              <p role="status" className="text-sm text-light">
                {m.results(filtered.length)}
              </p>
              {hasFilters ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold uppercase tracking-wider text-light hover:text-red transition-colors"
                >
                  <X className="h-4 w-4" />
                  {m.reset}
                </button>
              ) : null}
            </div>

            <h2 className="sr-only">{m.gridTitle}</h2>
            {filtered.length > 0 ? (
              <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((part, index) => (
                  <li key={part._id}>
                    <PartCard part={part} index={index} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="border border-dark-3 bg-dark px-6 py-14 text-center">
                <h2 className="font-display text-3xl leading-none text-off-white mb-3">{m.noResultsTitle}</h2>
                <p className="mx-auto max-w-md text-light leading-relaxed">{m.noResultsText}</p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <button type="button" onClick={resetFilters} className="btn-secondary">
                    {m.reset}
                  </button>
                  <a href={`#${PART_ENQUIRY_ID}`} className="btn-primary">
                    {m.emptyAction}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <PartEnquirySection models={models} />
    </>
  )
}

function CategoryLink({ href, active, label, count }: { href: string; active: boolean; label: string; count: number }) {
  return (
    <Link
      href={href}
      replace
      scroll={false}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex min-h-10 items-center gap-2 border px-4 text-xs font-semibold uppercase tracking-wider transition-colors',
        active ? 'border-red bg-red text-white' : 'border-dark-3 text-light hover:border-red hover:text-off-white',
      )}
    >
      {label}
      <span className={cn('font-mono text-[11px]', active ? 'text-white/80' : 'text-light/80')}>{count}</span>
    </Link>
  )
}
