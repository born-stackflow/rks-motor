'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { ArrowRight, Zap } from '@/components/ui/Icon'
import { formatPrice } from '@/lib/utils'
import { sanityClient, queries, urlFor } from '@/lib/sanity'
import type { BikeModelCard } from '@/lib/sanity'

const BRAND_LABELS: Record<string, string> = {
  aperyder: 'Ape Ryder',
  rks:      'RKS',
  skyjet:   'Skyjet',
}

const AVAIL_MAP = {
  'in-stock':       { label: 'In Stock',       variant: 'green' as const },
  'order-required': { label: 'Order Required', variant: 'amber' as const },
  'out-of-stock':   { label: 'Out of Stock',   variant: 'red'   as const },
}

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=300&q=80'

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.05, ease: 'easeOut' },
  }),
}

function modelImage(model: BikeModelCard): string {
  const src = model.thumbnailImage ?? model.heroImage
  if (src && (src as any)?.asset) return urlFor(src).width(320).height(200).quality(80).url()
  return FALLBACK_IMG
}

function modelSlug(model: BikeModelCard): string {
  return (model.slug as any)?.current ?? ''
}

export default function PricesPage() {
  const [models,   setModels]   = useState<BikeModelCard[]>([])
  const [loading,  setLoading]  = useState(true)
  const [brand,    setBrand]    = useState('all')

  useEffect(() => {
    sanityClient.fetch(queries.allModels)
      .then((data: BikeModelCard[]) => setModels(data ?? []))
      .finally(() => setLoading(false))
  }, [])

  // Unique brands from CMS data
  const brands = [
    { value: 'all', label: 'All Brands' },
    ...Array.from(new Set(models.map(m => m.category).filter(Boolean)))
      .map(b => ({ value: b, label: BRAND_LABELS[b] ?? b })),
  ]

  const filtered = brand === 'all' ? models : models.filter(m => m.category === brand)

  return (
    <div className="min-h-screen bg-black">

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative h-[40vh] min-h-[260px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1920&q=90"
          alt="E-Bike Price List"
          fill priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <p className="text-red text-xs font-semibold uppercase tracking-[0.3em] mb-3">
              2026 Price List
            </p>
            <h1
              className="text-off-white leading-none mb-2"
              style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(3rem, 7vw, 6rem)',
                letterSpacing: '0.02em',
              }}
            >
              E-Bike Pricing
            </h1>
            <div className="h-[3px] w-[60px] bg-red" />
          </div>
        </div>
      </section>

      {/* ── Brand filter ────────────────────────────────────────── */}
      <div className="border-b border-dark-3 bg-dark sticky top-0 z-10 overflow-x-auto">
        <div className="container">
          <div className="flex items-center gap-1 py-4 min-w-max">
            {brands.map(b => (
              <button
                key={b.value}
                onClick={() => setBrand(b.value)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  brand === b.value
                    ? 'bg-red text-white'
                    : 'text-light hover:text-off-white hover:bg-dark-3'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-10">

        {/* Count + disclaimer */}
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-light text-sm">
            <span className="text-off-white font-bold">{filtered.length}</span>{' '}
            model{filtered.length !== 1 ? 's' : ''}
          </p>
          <p className="text-xs text-mid">
            *All prices are RRP in EUR inclusive of VAT. Contact your dealer for final pricing.
          </p>
        </div>

        {/* ── Skeleton ────────────────────────────────────────────── */}
        {loading && (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-dark-2 border border-dark-3 animate-pulse" />
            ))}
          </div>
        )}

        {/* ── Empty state ─────────────────────────────────────────── */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Zap className="h-10 w-10 text-red/40 mb-4" />
            <h3 className="text-3xl text-off-white mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              No Models Found
            </h3>
            <p className="text-light text-sm mb-6">No e-bike models have been added to the CMS yet.</p>
            <Link href="/models" className="btn-secondary">Browse Models</Link>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            {/* ── Desktop table ───────────────────────────────────── */}
            <div className="hidden md:block">
              <div className="border border-dark-3">

                {/* Header */}
                <div className="grid grid-cols-[80px_1fr_180px_180px_160px_160px] bg-dark-2 border-b border-dark-3">
                  {['', 'Model', 'Motor', 'Range / Battery', 'Availability', 'RRP (EUR)'].map(h => (
                    <div
                      key={h}
                      className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-mid"
                    >
                      {h}
                    </div>
                  ))}
                </div>

                {filtered.map((model, i) => {
                  const avail = AVAIL_MAP[model.availability as keyof typeof AVAIL_MAP] ?? AVAIL_MAP['order-required']
                  const slug  = modelSlug(model)
                  const bg    = i % 2 === 0 ? 'bg-dark' : 'bg-black'

                  return (
                    <motion.div
                      key={model._id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      custom={i}
                      variants={fadeUp}
                      className={`grid grid-cols-[80px_1fr_180px_180px_160px_160px] group border-b border-dark-3 last:border-b-0 ${bg}`}
                    >
                      {/* Thumb */}
                      <div className="relative h-16 overflow-hidden">
                        <Image
                          src={modelImage(model)}
                          alt={model.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Name + brand */}
                      <div className="px-4 py-3 flex items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-off-white font-bold text-sm group-hover:text-red transition-colors">
                              {model.name}
                            </span>
                            {model.isNew && <Badge variant="gold">NEW</Badge>}
                          </div>
                          <span className="text-xs text-mid">
                            {BRAND_LABELS[model.category] ?? model.category}
                          </span>
                          {model.tagline && (
                            <p className="text-xs text-mid/70 mt-0.5 line-clamp-1">{model.tagline}</p>
                          )}
                        </div>
                      </div>

                      {/* Motor */}
                      <div className="px-4 py-3 flex items-center">
                        <span
                          className="text-light text-sm"
                          style={{ fontFamily: 'JetBrains Mono, monospace' }}
                        >
                          {model.motor ?? '—'}
                        </span>
                      </div>

                      {/* Range / Battery */}
                      <div className="px-4 py-3 flex items-center">
                        <div>
                          {model.range && (
                            <span
                              className="text-red font-bold text-sm block"
                              style={{ fontFamily: 'JetBrains Mono, monospace' }}
                            >
                              {model.range}
                            </span>
                          )}
                          {model.battery && (
                            <span
                              className="text-mid text-xs"
                              style={{ fontFamily: 'JetBrains Mono, monospace' }}
                            >
                              {model.battery}
                            </span>
                          )}
                          {!model.range && !model.battery && (
                            <span className="text-mid text-sm">—</span>
                          )}
                        </div>
                      </div>

                      {/* Availability */}
                      <div className="px-4 py-3 flex items-center">
                        <Badge variant={avail.variant}>{avail.label}</Badge>
                      </div>

                      {/* Price + CTA */}
                      <div className="px-4 py-3 flex items-center gap-3">
                        <span className="text-off-white font-bold text-lg">
                          {model.price ? formatPrice(model.price) : 'POA'}
                        </span>
                        {slug && (
                          <Link
                            href={`/models/${slug}`}
                            className="shrink-0 flex items-center gap-1 text-xs text-red hover:text-red/70 font-semibold uppercase tracking-wider transition-colors"
                          >
                            Details <ArrowRight className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* ── Mobile cards ────────────────────────────────────── */}
            <div className="md:hidden space-y-4">
              {filtered.map((model, i) => {
                const avail = AVAIL_MAP[model.availability as keyof typeof AVAIL_MAP] ?? AVAIL_MAP['order-required']
                const slug  = modelSlug(model)

                return (
                  <motion.div
                    key={model._id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    variants={fadeUp}
                  >
                    <Link
                      href={slug ? `/models/${slug}` : '#'}
                      className="group card overflow-hidden flex gap-0 hover:border-red transition-colors"
                    >
                      <div className="relative w-28 shrink-0">
                        <Image
                          src={modelImage(model)}
                          alt={model.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4 flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="text-off-white font-bold text-sm group-hover:text-red transition-colors leading-tight">
                            {model.name}
                          </span>
                          {model.isNew && <Badge variant="gold">NEW</Badge>}
                        </div>
                        <p className="text-mid text-xs mb-1">
                          {BRAND_LABELS[model.category] ?? model.category}
                          {model.motor ? ` · ${model.motor}` : ''}
                        </p>
                        {model.range && (
                          <p className="text-red text-xs font-semibold mb-2">
                            Range: {model.range}
                          </p>
                        )}
                        <Badge variant={avail.variant}>{avail.label}</Badge>
                        <p className="text-lg font-bold text-off-white mt-2">
                          {model.price ? formatPrice(model.price) : 'POA'}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </>
        )}

        {/* ── Disclaimer ──────────────────────────────────────────── */}
        <div className="mt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 bg-dark border border-dark-3">
          <p className="text-light text-sm leading-relaxed max-w-lg">
            All prices shown are{' '}
            <span className="text-off-white font-semibold">
              Recommended Retail Prices (RRP) in EUR
            </span>
            , inclusive of VAT. Prices may vary by country and dealer.{' '}
            <span className="text-off-white font-semibold">POA</span> = Price on Application.
            Contact your nearest authorised RKS dealer for confirmed local pricing and financing options.
          </p>
          <Link href="/contact?type=purchase" className="btn-primary shrink-0 inline-flex items-center gap-2">
            Get a Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ── Trade pricing CTA ───────────────────────────────────── */}
        <div className="mt-8 p-6 bg-dark-2 border-l-4 border-red">
          <p className="text-red text-xs font-semibold uppercase tracking-[0.2em] mb-2">For Business</p>
          <h2
            className="text-off-white text-3xl mb-2"
            style={{ fontFamily: 'Bebas Neue, sans-serif' }}
          >
            Trade & Fleet Pricing Available
          </h2>
          <p className="text-light text-sm mb-6 max-w-xl">
            Dealers, fleet buyers, and rental operators can access wholesale pricing through our
            authorised trade partner programme. Volume discounts available from 5+ units.
          </p>
          <Link href="/trade/apply" className="btn-primary inline-flex items-center gap-2">
            Apply as Trade Partner <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  )
}
