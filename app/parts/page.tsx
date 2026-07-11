'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { PartCard } from '@/components/ui/PartCard'
import { ChevronDown, Search, SlidersHorizontal, X } from '@/components/ui/Icon'
import { formatPrice } from '@/lib/utils'
import { sanityClient, queries, urlFor } from '@/lib/sanity'
import type { BikePartCard } from '@/lib/sanity'

const CATEGORY_LABELS: Record<string, string> = {
  motor:       'Motor & Drive',
  battery:     'Battery & Charging',
  brakes:      'Brakes',
  suspension:  'Suspension & Steering',
  electrical:  'Electrical & Lighting',
  gears:       'Gears & Drivetrain',
  body:        'Body & Frame',
  tyres:       'Tyres & Wheels',
  accessories: 'Accessories',
}

const AVAILABILITY_OPTIONS = ['All', 'In Stock', 'Order Required', 'Out of Stock']

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.07, ease: 'easeOut' } }),
}

export default function PartsPage() {
  const [allParts,      setAllParts]      = useState<BikePartCard[]>([])
  const [loading,       setLoading]       = useState(true)
  const [search,        setSearch]        = useState('')
  const [category,      setCategory]      = useState('All')
  const [model,         setModel]         = useState('All Models')
  const [availability,  setAvailability]  = useState('All')
  const [maxPrice,      setMaxPrice]      = useState(1000)
  const [sortBy,        setSortBy]        = useState('name')
  const [filtersOpen,   setFiltersOpen]   = useState(false)
  const [openSection,   setOpenSection]   = useState<string | null>('model')

  useEffect(() => {
    sanityClient.fetch(queries.allParts).then((data: BikePartCard[]) => {
      setAllParts(data ?? [])
      setLoading(false)
      const top = Math.max(...(data ?? []).map(p => p.retailPrice ?? 0), 1000)
      setMaxPrice(top)
    })
  }, [])

  const categories = useMemo(() => {
    const cats = Array.from(new Set(allParts.map(p => p.category).filter(Boolean)))
    return cats.sort()
  }, [allParts])

  const compatibleModelNames = useMemo(() => {
    const names = new Set<string>()
    allParts.forEach(p => p.compatibleModels?.forEach(m => names.add(m.name)))
    return ['All Models', ...Array.from(names).sort()]
  }, [allParts])

  const priceMax = useMemo(() => Math.max(...allParts.map(p => p.retailPrice ?? 0), 1000), [allParts])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return allParts
      .filter(p => {
        if (q && !p.name.toLowerCase().includes(q) && !p.partNumber?.toLowerCase().includes(q)) return false
        if (category !== 'All' && p.category !== category) return false
        if (model !== 'All Models' && !p.compatibleModels?.some(m => m.name === model)) return false
        if ((p.retailPrice ?? 0) > maxPrice) return false
        if (availability === 'In Stock'       && p.availability !== 'in-stock')       return false
        if (availability === 'Order Required' && p.availability !== 'order-required') return false
        if (availability === 'Out of Stock'   && p.availability !== 'out-of-stock')   return false
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'price-low')   return (a.retailPrice ?? 0) - (b.retailPrice ?? 0)
        if (sortBy === 'price-high')  return (b.retailPrice ?? 0) - (a.retailPrice ?? 0)
        if (sortBy === 'part-number') return (a.partNumber ?? '').localeCompare(b.partNumber ?? '')
        return a.name.localeCompare(b.name)
      })
  }, [search, category, model, availability, maxPrice, sortBy, allParts])

  const hasFilters = search || category !== 'All' || model !== 'All Models' || availability !== 'All' || maxPrice < priceMax
  const clearAll   = () => { setSearch(''); setCategory('All'); setModel('All Models'); setAvailability('All'); setMaxPrice(priceMax) }

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border-b border-dark-3 last:border-0">
      <button
        onClick={() => setOpenSection(openSection === title ? null : title)}
        className="w-full flex items-center justify-between py-4 text-xs font-semibold uppercase tracking-wider text-off-white hover:text-red transition-colors"
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
      <div className="relative h-[40vh] min-h-[260px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1601758174493-bc7a2b5a4a87?w=1920&q=90"
          alt="E-Bike Parts & Accessories"
          fill priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <p className="text-red text-xs font-semibold uppercase tracking-[0.3em] mb-3">Genuine OEM</p>
              <h1
                className="text-off-white leading-none mb-2"
                style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '0.02em' }}
              >
                E-Bike Parts & Accessories
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
                  {CATEGORY_LABELS[cat] ?? cat}
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
              <span className="text-off-white font-bold">{filtered.length}</span> part{filtered.length !== 1 ? 's' : ''}
            </p>
            {hasFilters && (
              <button onClick={clearAll} className="flex items-center gap-1 text-xs text-red hover:text-red-light uppercase tracking-wider font-semibold">
                <X className="h-3 w-3" /> Clear
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
              <option value="part-number">Part Number</option>
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
                  placeholder="Part name or number..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="input pl-10 text-sm"
                />
              </div>

              {/* Compatible E-Bike Model */}
              <FilterSection title="Compatible E-Bike">
                <div className="bg-red/10 border border-red/20 p-3 mb-3">
                  <p className="text-xs text-red font-semibold uppercase tracking-wider mb-2">Filter by your e-bike</p>
                  <select
                    value={model}
                    onChange={e => setModel(e.target.value)}
                    className="select text-sm w-full"
                  >
                    {compatibleModelNames.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </FilterSection>

              {/* Category */}
              <FilterSection title="Category">
                <div className="space-y-2">
                  {['All', ...categories].map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <span
                        className={`w-4 h-4 shrink-0 border-2 flex items-center justify-center transition-colors ${
                          category === cat ? 'border-red bg-red' : 'border-dark-3 group-hover:border-red'
                        }`}
                        onClick={() => setCategory(cat)}
                      >
                        {category === cat && <span className="w-2 h-2 bg-white" />}
                      </span>
                      <span className="text-sm text-light group-hover:text-off-white transition-colors">
                        {cat === 'All' ? 'All Categories' : (CATEGORY_LABELS[cat] ?? cat)}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Availability */}
              <FilterSection title="Availability">
                <div className="space-y-2">
                  {AVAILABILITY_OPTIONS.map(opt => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                      <span
                        className={`w-4 h-4 shrink-0 border-2 flex items-center justify-center transition-colors ${
                          availability === opt ? 'border-red bg-red' : 'border-dark-3 group-hover:border-red'
                        }`}
                        onClick={() => setAvailability(opt)}
                      >
                        {availability === opt && <span className="w-2 h-2 bg-white" />}
                      </span>
                      <span className="text-sm text-light group-hover:text-off-white transition-colors">{opt}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Max Price */}
              <FilterSection title="Max Price">
                <div className="px-1">
                  <input
                    type="range"
                    min={0} max={priceMax} step={10}
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
            {/* Showing parts for model banner */}
            {model !== 'All Models' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-dark border border-red/30 flex items-center justify-between gap-4"
              >
                <p className="text-sm text-off-white">
                  <span className="text-red font-semibold">Showing parts for:</span> {model}
                </p>
                <button onClick={() => setModel('All Models')} className="text-xs text-mid hover:text-red transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="card aspect-[4/3] animate-pulse bg-dark-2" />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((part, i) => (
                  <PartCard
                    key={part._id}
                    name={part.name}
                    slug={(part.slug as any)?.current ?? ''}
                    partNumber={part.partNumber}
                    category={CATEGORY_LABELS[part.category] ?? part.category}
                    price={part.retailPrice}
                    availability={part.availability as 'in-stock' | 'order-required' | 'out-of-stock' | undefined}
                    image={
                      (part.image as any)?.asset
                        ? urlFor(part.image!).width(800).url()
                        : undefined
                    }
                    compatibleCount={part.compatibleModels?.length}
                    isOEM={part.partType === 'oem'}
                    index={i}
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
                <h3 className="text-3xl text-off-white mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  No Parts Found
                </h3>
                <p className="text-light text-sm mb-6">Try adjusting your filters or search term.</p>
                <button onClick={clearAll} className="btn-primary">Clear All Filters</button>
              </motion.div>
            )}

            {/* Help callout */}
            {!loading && filtered.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 p-8 bg-dark border-l-4 border-red relative overflow-hidden"
              >
                <div className="absolute inset-0">
                  <Image
                    src="https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=1200&q=80"
                    alt="Parts team"
                    fill
                    className="object-cover opacity-5"
                  />
                </div>
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red mb-2">Expert Help</p>
                    <h3 className="text-2xl text-off-white mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                      Can't Find the Right E-Bike Part?
                    </h3>
                    <p className="text-light text-sm max-w-md">Our parts specialists will source exactly what you need for your e-bike — OEM or compatible.</p>
                  </div>
                  <a href="/contact?type=parts" className="btn-primary shrink-0">Contact Parts Team</a>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
