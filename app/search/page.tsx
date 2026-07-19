'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { Search, ArrowRight } from '@/components/ui/Icon'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { formatPrice } from '@/lib/utils'

const searchData = {
  models: [
    { id: '1', name: 'Thunder Sport 650',  category: 'Sport',     price: 12999, url: '/models/thunder-sport-650',  type: 'model' as const },
    { id: '2', name: 'Adventure Pro 800',  category: 'Adventure', price: 15799, url: '/models/adventure-pro-800',  type: 'model' as const },
    { id: '3', name: 'Urban Cruiser 400',  category: 'Cruiser',   price: 8499,  url: '/models/urban-cruiser-400',  type: 'model' as const },
    { id: '4', name: 'Street Naked 500',   category: 'Naked',     price: 7999,  url: '/models/street-naked-500',   type: 'model' as const },
    { id: '5', name: 'R-E1000 Electric',   category: 'Electric',  price: 21999, url: '/models/r-e1000-electric',   type: 'model' as const },
  ],
  parts: [
    { id: '1', name: 'Sport Air Filter Kit',      partNumber: 'ENG-AF-002', category: 'Engine',    price: 125, url: '/parts/sport-air-filter',   type: 'part' as const },
    { id: '2', name: 'HP Brake Pads',             partNumber: 'BRK-HP-001', category: 'Brakes',    price: 89,  url: '/parts/hp-brake-pads',       type: 'part' as const },
    { id: '3', name: 'LED Headlight Assembly',    partNumber: 'ELC-HL-003', category: 'Electrical', price: 249, url: '/parts/led-headlight',       type: 'part' as const },
  ],
  news: [
    { id: '1', title: 'New Thunder Sport 650R Unveiled', category: 'Product Launch', date: '15 March 2024', url: '/news/thunder-sport-650r-eicma', type: 'news' as const },
    { id: '2', title: 'RKS Wins MotoGP Constructor Title', category: 'Racing', date: '10 March 2024', url: '/news/motogp-constructor-championship', type: 'news' as const },
  ],
}

function SearchResults() {
  const params = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const [inputVal, setInputVal] = useState(params.get('q') ?? '')

  const results = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return { models: [], parts: [], news: [] }
    return {
      models: searchData.models.filter(m => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)),
      parts:  searchData.parts.filter(p => p.name.toLowerCase().includes(q) || p.partNumber.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)),
      news:   searchData.news.filter(n => n.title.toLowerCase().includes(q) || n.category.toLowerCase().includes(q)),
    }
  }, [query])

  const total = results.models.length + results.parts.length + results.news.length

  return (
    <div className="min-h-screen bg-black">
      {/* Search bar header */}
      <div className="border-b border-dark-3 bg-dark-2 py-8">
        <div className="container">
          <p className="text-red text-xs font-semibold uppercase tracking-[0.3em] mb-4">Site Search</p>
          <form onSubmit={e => { e.preventDefault(); setQuery(inputVal) }} className="flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-mid" />
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Search models, parts, news..."
                className="input pl-12 text-base h-14 w-full"
                autoFocus
              />
            </div>
            <button type="submit" className="btn-primary px-8">
              Search <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          {query && (
            <p className="text-light text-sm mt-4">
              {total > 0
                ? <><span className="text-off-white font-bold">{total}</span> result{total !== 1 ? 's' : ''} for &quot;<span className="text-red">{query}</span>&quot;</>
                : <>No results for &quot;<span className="text-red">{query}</span>&quot;</>
              }
            </p>
          )}
        </div>
      </div>

      <div className="container py-10">
        {!query && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Search className="h-14 w-14 text-red/30 mb-5" />
            <h2 className="text-4xl text-off-white mb-3" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>What Are You Looking For?</h2>
            <p className="text-light text-sm">Search for models, parts, news, and more.</p>
          </div>
        )}

        {query && total === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 bg-red/10 border border-red/20 flex items-center justify-center mb-5">
              <Search className="h-8 w-8 text-red/60" />
            </div>
            <h2 className="text-4xl text-off-white mb-3" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>No Results Found</h2>
            <p className="text-light text-sm mb-6">Try a different search term, or browse our catalogue directly.</p>
            <div className="flex gap-3 flex-wrap justify-center">
              <Link href="/models" className="btn-primary">Browse Models</Link>
              <Link href="/parts" className="btn-secondary">Browse Parts</Link>
            </div>
          </div>
        )}

        {query && total > 0 && (
          <div className="space-y-12">
            {results.models.length > 0 && (
              <section>
                <h2 className="text-2xl text-off-white mb-6" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  Models <span className="text-mid text-base ml-2">({results.models.length})</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {results.models.map((m, i) => (
                    <motion.div key={m.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                      <Link href={m.url} className="group card overflow-hidden flex flex-col hover:border-red">
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <ImagePlaceholder />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-3 left-3"><Badge variant="red">{m.category}</Badge></div>
                        </div>
                        <div className="p-4 flex items-center justify-between gap-2">
                          <div>
                            <h3 className="text-off-white font-bold group-hover:text-red transition-colors">{m.name}</h3>
                            <p className="text-gold font-bold">{formatPrice(m.price)}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-red shrink-0" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {results.parts.length > 0 && (
              <section>
                <h2 className="text-2xl text-off-white mb-6" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  Parts <span className="text-mid text-base ml-2">({results.parts.length})</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {results.parts.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                      <Link href={p.url} className="group card overflow-hidden flex flex-col hover:border-red">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <ImagePlaceholder />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-3 left-3"><Badge variant="dark">{p.category}</Badge></div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-off-white font-bold text-sm group-hover:text-red transition-colors">{p.name}</h3>
                          <p className="text-gold text-xs mt-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{p.partNumber}</p>
                          <p className="text-off-white font-bold mt-1">{formatPrice(p.price)}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {results.news.length > 0 && (
              <section>
                <h2 className="text-2xl text-off-white mb-6" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  News <span className="text-mid text-base ml-2">({results.news.length})</span>
                </h2>
                <div className="space-y-3">
                  {results.news.map(n => (
                    <Link key={n.id} href={n.url} className="group flex items-center justify-between p-5 card hover:border-red">
                      <div>
                        <Badge variant={n.category === 'Racing' ? 'gold' : 'red'}>{n.category}</Badge>
                        <h3 className="text-off-white font-bold text-sm mt-2 group-hover:text-red transition-colors">{n.title}</h3>
                        <p className="text-mid text-xs mt-1">{n.date}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-red shrink-0" />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SearchResults />
    </Suspense>
  )
}
