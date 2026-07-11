'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ModelCard } from '@/components/ui/ModelCard'
import { ChevronDown, Search, SlidersHorizontal, X, ArrowRight } from '@/components/ui/Icon'
import { formatPrice } from '@/lib/utils'
import { sanityClient, queries, urlFor } from '@/lib/sanity'
import type { BikeModelCard } from '@/lib/sanity'

const BRAND_LABELS: Record<string, string> = {
  aperyder: 'Ape Ryder',
  rks:      'RKS',
  skyjet:   'Skyjet',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden:  { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' } }),
}

export default function ModelsPage() {
  const searchParams   = useSearchParams()
  const brandParam     = searchParams.get('brand') ?? 'All'

  const [allModels,     setAllModels]     = useState<BikeModelCard[]>([])
  const [loading,       setLoading]       = useState(true)
  const [search,        setSearch]        = useState('')
  const [category,      setCategory]      = useState(brandParam)
  const [sortBy,        setSortBy]        = useState('name')
  const [maxPrice,      setMaxPrice]      = useState(10000)
  const [compare,       setCompare]       = useState<string[]>([])
  const [filtersOpen,   setFiltersOpen]   = useState(false)
  const [openSection,   setOpenSection]   = useState<string | null>('brand')

  useEffect(() => {
    sanityClient.fetch(queries.allModels).then((data: BikeModelCard[]) => {
      setAllModels(data ?? [])
      setLoading(false)
      // set max price ceiling from data
      const top = Math.max(...(data ?? []).map(m => m.price ?? 0), 10000)
      setMaxPrice(top)
    })
  }, [])

  const toggleCompare = (id: string) => {
    setCompare(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
    )
  }

  const categories = useMemo(() => {
    const cats = Array.from(new Set(allModels.map(m => m.category).filter(Boolean)))
    return cats
  }, [allModels])

  const priceMax = useMemo(() => Math.max(...allModels.map(m => m.price ?? 0), 10000), [allModels])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return allModels
      .filter(m => {
        if (q && !m.name.toLowerCase().includes(q)) return false
        if (category !== 'All' && m.category !== category) return false
        if ((m.price ?? 0) > maxPrice) return false
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'price-low')  return (a.price ?? 0) - (b.price ?? 0)
        if (sortBy === 'price-high') return (b.price ?? 0) - (a.price ?? 0)
        if (sortBy === 'newest')     return Number(b.isNew) - Number(a.isNew)
        return a.name.localeCompare(b.name)
      })
  }, [search, category, maxPrice, sortBy, allModels])

  const hasFilters = search || category !== 'All' || maxPrice < priceMax
  const clearAll   = () => { setSearch(''); setCategory('All'); setMaxPrice(priceMax) }

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border-b border-dark-3 last:border-0">
      <button
        onClick={() => setOpenSection(openSection === title ? null : title)}
        className="w-full flex items-center justify-between py-4 text-sm font-semibold uppercase tracking-wider text-off-white hover:text-red transition-colors"
      >
        {title}
        <ChevronDown className={`h-4 w-4 transition-transform ${openSection === title ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {openSection === title && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden pb-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <div className="min-h-screen bg-black">
      {/* Hero banner */}
      <div className="relative h-[40vh] min-h-[280px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=90"
          alt="Our E-Bikes"
          fill priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <p className="text-red text-xs font-semibold uppercase tracking-[0.3em] mb-3">Our Lineup</p>
              <h1
                className="text-off-white leading-none mb-2"
                style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '0.02em' }}
              >
                Our E-Bikes
              </h1>
              <div className="h-[3px] w-[60px] bg-red" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Category pill bar */}
      {categories.length > 0 && (
        <div className="border-b border-dark-3 bg-dark overflow-x-auto">
          <div className="container">
            <div className="flex items-center gap-1 py-4 min-w-max">
              <button
                onClick={() => setCategory('All')}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  category === 'All' ? 'bg-red text-white' : 'text-light hover:text-off-white hover:bg-dark-3'
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                    category === cat ? 'bg-red text-white' : 'text-light hover:text-off-white hover:bg-dark-3'
                  }`}
                >
                  {BRAND_LABELS[cat] ?? cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container py-10">
        {/* Sort + filter bar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <p className="text-light text-sm">
              <span className="text-off-white font-bold">{filtered.length}</span> model{filtered.length !== 1 ? 's' : ''}
            </p>
            {hasFilters && (
              <button onClick={clearAll} className="flex items-center gap-1 text-xs text-red hover:text-red-light uppercase tracking-wider font-semibold">
                <X className="h-3 w-3" /> Clear filters
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="select text-xs uppercase tracking-wider h-10 px-3 w-auto"
            >
              <option value="name">Name A–Z</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="newest">Newest First</option>
            </select>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="lg:hidden flex items-center gap-2 h-10 px-4 border border-dark-3 hover:border-red text-light hover:text-off-white text-xs uppercase tracking-wider transition-all"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
              {hasFilters && <span className="w-2 h-2 bg-red rounded-full" />}
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block w-full lg:w-[280px] shrink-0`}>
            <div className="sticky top-[88px] bg-dark border border-dark-3 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-light">Filters</h3>
                {hasFilters && (
                  <button onClick={clearAll} className="text-xs text-red hover:text-red-light font-semibold uppercase tracking-wider">
                    Clear All
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mid" />
                <input
                  type="text"
                  placeholder="Search models..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="input pl-10 text-sm"
                />
              </div>

              {/* Brand filter */}
              {categories.length > 0 && (
                <FilterSection title="Brand">
                  <div className="space-y-2">
                    {['', ...categories].map(cat => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <span
                          className={`w-4 h-4 shrink-0 border-2 flex items-center justify-center transition-colors ${
                            (cat === '' ? category === 'All' : category === cat)
                              ? 'border-red bg-red'
                              : 'border-dark-3 group-hover:border-red'
                          }`}
                          onClick={() => setCategory(cat === '' ? 'All' : cat)}
                        >
                          {(cat === '' ? category === 'All' : category === cat) && (
                            <span className="w-2 h-2 bg-white" />
                          )}
                        </span>
                        <span className="text-sm text-light group-hover:text-off-white transition-colors">
                          {cat === '' ? 'All Categories' : (BRAND_LABELS[cat] ?? cat)}
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterSection>
              )}

              <FilterSection title="Max Price">
                <div className="px-1">
                  <input
                    type="range"
                    min={0} max={priceMax} step={100}
                    value={maxPrice}
                    onChange={e => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-red mb-2"
                  />
                  <div className="flex justify-between text-xs text-mid">
                    <span>€0</span>
                    <span className="text-gold font-semibold">{formatPrice(maxPrice)}</span>
                    <span>{formatPrice(priceMax)}</span>
                  </div>
                </div>
              </FilterSection>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <p className="text-light text-sm animate-pulse">Loading models…</p>
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((model, i) => (
                  <ModelCard
                    key={model._id}
                    name={model.name}
                    slug={model.slug?.current ?? ''}
                    category={BRAND_LABELS[model.category] ?? model.category}
                    price={model.price}
                    tagline={model.tagline}
                    image={(model.thumbnailImage as any)?.asset ? urlFor(model.thumbnailImage!).width(800).url() : (model.heroImage as any)?.asset ? urlFor(model.heroImage!).width(800).url() : undefined}
                    isNew={model.isNew}
                    isFeatured={model.isFeatured}
                    index={i}
                    onCompare={() => toggleCompare(model._id)}
                    compareSelected={compare.includes(model._id)}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <div className="w-16 h-16 bg-red/10 border border-red/20 flex items-center justify-center mb-6">
                  <Search className="h-8 w-8 text-red/60" />
                </div>
                <h3
                  className="text-3xl text-off-white mb-2"
                  style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                >
                  No Models Found
                </h3>
                <p className="text-light text-sm mb-6">Try adjusting your filters or search term.</p>
                <button onClick={clearAll} className="btn-primary">Clear All Filters</button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Compare bar */}
      <AnimatePresence>
        {compare.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-dark-2 border-t-2 border-red shadow-red-lg"
          >
            <div className="container py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-light hidden sm:block">Compare:</span>
                <div className="flex items-center gap-3">
                  {compare.map(id => {
                    const m = allModels.find(x => x._id === id)
                    return m ? (
                      <div key={id} className="flex items-center gap-2 bg-dark-3 px-3 py-1.5">
                        <span className="text-sm text-off-white font-medium truncate max-w-[120px]">{m.name}</span>
                        <button onClick={() => toggleCompare(id)} className="text-mid hover:text-red transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : null
                  })}
                  {compare.length < 3 && (
                    <div className="border border-dashed border-dark-3 px-6 py-1.5 text-xs text-mid">
                      + Add model
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => setCompare([])} className="btn-ghost text-xs">Clear</button>
                <Link
                  href={`/compare?ids=${compare.join(',')}`}
                  className={`btn-primary text-xs ${compare.length < 2 ? 'opacity-40 pointer-events-none' : ''}`}
                >
                  Compare Now <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
