'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { PartCard } from '@/components/ui/PartCard'
import { ArrowRight, ChevronLeft, Check, X } from '@/components/ui/Icon'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { formatPrice } from '@/lib/utils'

const partData = {
  name: 'High-Performance Air Filter Kit',
  slug: 'sport-air-filter',
  partNumber: 'ENG-AF-650-002',
  manufacturerPartNumber: '123-E1311-00-00',
  category: 'engine',
  partType: 'oem' as const,
  description: 'High-flow OEM air filter engineered for the Thunder Sport 650. Increases intake airflow by 15% over the standard filter while maintaining superior filtration. Premium synthetic media with UV-protective coating for extended service life.',
  availability: 'in-stock' as const,
  leadTime: 'Dispatched within 24 hours',
  price: 125,
  soldAs: 'Single Unit',
  packageIncludes: ['1× Air Filter', 'Installation Instructions', 'Service Interval Sticker'],
  warranty: '24 months manufacturer warranty',
  gallery: [0, 1, 2, 3],
  specs: {
    identification: {
      'Part Number':           'ENG-AF-650-002',
      'OEM Reference':         '123-E1311-00-00',
      'Part Type':             'OEM Original',
      'Category':              'Engine Parts',
    },
    dimensions: {
      'Length':                '180 mm',
      'Width':                 '150 mm',
      'Height':                '50 mm',
      'Weight':                '250 g',
    },
    technical: {
      'Filtration Efficiency': '99.5%',
      'Airflow Increase':      '+15% vs. Standard',
      'Filter Media':          'Premium Synthetic',
      'Surface Finish':        'Oiled',
      'Service Interval':      '15,000 km',
      'Cleaning Interval':     '5,000 km',
    },
    environment: {
      'Operating Temp Min':    '−30°C',
      'Operating Temp Max':    '+120°C',
      'Emission Compliance':   'Euro 5',
    },
  },
  compatibleModels: [
    { name: 'Thunder Sport 650', slug: 'thunder-sport-650', years: '2020–2024', notes: 'All variants — direct fit' },
    { name: 'Street Naked 500',  slug: 'street-naked-500',  years: '2021–2024', notes: 'Requires bracket (sold separately)' },
    { name: 'Urban Cruiser 400', slug: 'urban-cruiser-400', years: '2022–2024', notes: 'All variants — direct fit' },
  ],
}

const relatedParts = [
  { id: 1, name: 'Engine Oil Filter',    slug: 'engine-oil-filter',  partNumber: 'ENG-OF-006', category: 'engine',    price: 19,  availability: 'in-stock' as const,  isOEM: true },
  { id: 2, name: 'Spark Plugs Set (4)',  slug: 'spark-plugs-set',    partNumber: 'ENG-SP-007', category: 'engine',    price: 34,  availability: 'in-stock' as const,  isOEM: true },
  { id: 3, name: 'Fuel Filter',          slug: 'fuel-filter',        partNumber: 'FUL-FF-008', category: 'fuel',      price: 25,  availability: 'in-stock' as const,  isOEM: true },
]

const availabilityMap = {
  'in-stock':       { label: 'In Stock',      variant: 'green' as const },
  'order-required': { label: 'Order Required', variant: 'amber' as const },
  'out-of-stock':   { label: 'Out of Stock',   variant: 'red'   as const },
}

const categoryLabel: Record<string, string> = {
  engine: 'Engine Parts', brakes: 'Brakes', electrical: 'Electrical', suspension: 'Suspension',
  transmission: 'Transmission', body: 'Body & Frame', cooling: 'Cooling', fuel: 'Fuel System', accessories: 'Accessories',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function PartDetailPage() {
  const [activeImage,  setActiveImage]  = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeSpec,   setActiveSpec]   = useState<string>('identification')

  const avail    = availabilityMap[partData.availability]
  const catLabel = categoryLabel[partData.category] || partData.category
  const specSections = Object.entries(partData.specs)

  return (
    <div className="min-h-screen bg-black">
      {/* Breadcrumb */}
      <div className="border-b border-dark-3 bg-dark-2">
        <div className="container py-3 flex items-center gap-2 text-xs text-mid">
          <Link href="/parts" className="flex items-center gap-1 hover:text-red transition-colors">
            <ChevronLeft className="h-3 w-3" /> Parts
          </Link>
          <span>/</span>
          <Link href={`/parts?category=${partData.category}`} className="hover:text-red transition-colors">{catLabel}</Link>
          <span>/</span>
          <span className="text-off-white">{partData.name}</span>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-10 xl:gap-14">

          {/* ── LEFT ─────────────────────────────────────────── */}
          <div className="min-w-0">
            {/* Main image */}
            <motion.div
              initial="hidden" animate="visible" variants={fadeUp}
              className="relative aspect-[4/3] overflow-hidden bg-dark cursor-zoom-in group"
              onClick={() => setLightboxOpen(true)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <ImagePlaceholder />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 right-3 bg-black/60 px-2 py-1 text-xs text-mid">
                {activeImage + 1} / {partData.gallery.length}
              </div>
            </motion.div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              {partData.gallery.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative aspect-[4/3] overflow-hidden border-2 transition-all ${i === activeImage ? 'border-red' : 'border-dark-3 opacity-60 hover:opacity-90'}`}
                >
                  <ImagePlaceholder />
                </button>
              ))}
            </div>

            {/* Spec Tabs */}
            <div className="mt-10">
              <div className="flex gap-0 border-b border-dark-3 overflow-x-auto">
                {specSections.map(([key]) => (
                  <button
                    key={key}
                    onClick={() => setActiveSpec(key)}
                    className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 -mb-[2px] ${
                      activeSpec === key ? 'border-red text-red' : 'border-transparent text-light hover:text-off-white'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSpec}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-1"
                >
                  {Object.entries(partData.specs[activeSpec as keyof typeof partData.specs]).map(([label, value], i) => (
                    <div key={label} className={`spec-row ${i % 2 === 0 ? 'bg-black' : 'bg-dark'}`}>
                      <span className="spec-label">{label}</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Compatible Models */}
            <div className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-light mb-5">Compatible Models</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {partData.compatibleModels.map((m) => (
                  <Link
                    key={m.slug}
                    href={`/models/${m.slug}`}
                    className="group card overflow-hidden flex flex-col hover:border-red"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <ImagePlaceholder />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="p-4">
                      <h4 className="text-off-white font-bold text-sm group-hover:text-red transition-colors">{m.name}</h4>
                      <p className="text-mid text-xs mt-1">{m.years}</p>
                      <p className="text-light text-xs mt-1 leading-snug">{m.notes}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-red font-semibold">
                        View Model <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mt-10 p-6 bg-dark border border-dark-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-light mb-3">About This Part</p>
              <p className="text-light text-sm leading-relaxed">{partData.description}</p>
            </div>
          </div>

          {/* ── RIGHT (sticky) ──────────────────────────────── */}
          <div className="lg:sticky lg:top-[88px] h-fit">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-5">

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="red">{catLabel}</Badge>
                <Badge variant="gold">{partData.partType === 'oem' ? 'OEM Original' : 'Aftermarket'}</Badge>
                <Badge variant={avail.variant}>{avail.label}</Badge>
              </div>

              {/* Name */}
              <h1
                className="text-off-white leading-none"
                style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '0.02em' }}
              >
                {partData.name}
              </h1>

              {/* Part Number — hero element */}
              <div className="bg-dark border border-dark-3 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mid mb-1">Part Number</p>
                <p
                  className="text-gold text-2xl font-bold tracking-widest"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {partData.partNumber}
                </p>
                {partData.manufacturerPartNumber && (
                  <p className="text-mid text-xs mt-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    OEM: {partData.manufacturerPartNumber}
                  </p>
                )}
              </div>

              {/* Price + availability */}
              <div className="border-b border-dark-3 pb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mid mb-1">Retail Price</p>
                <p className="text-4xl font-bold text-gold" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  {formatPrice(partData.price)}
                </p>
                <p className="text-xs text-mid mt-1">Sold as: {partData.soldAs}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                  <span className="text-xs text-light">{partData.leadTime}</span>
                </div>
              </div>

              {/* Package includes */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-light">Package Includes</p>
                {partData.packageIncludes.map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <Check className="h-3.5 w-3.5 text-red shrink-0" />
                    <span className="text-sm text-off-white">{item}</span>
                  </div>
                ))}
              </div>

              {/* Installation notes */}
              <div className="p-4 bg-dark border border-dark-3 space-y-2">
                {['Direct OEM replacement — no modifications required', 'Installation instructions included', 'Professional installation recommended'].map(note => (
                  <div key={note} className="flex items-start gap-3">
                    <Check className="h-3.5 w-3.5 text-red shrink-0 mt-0.5" />
                    <span className="text-xs text-light leading-snug">{note}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3 pt-2">
                <Link href={`/contact?part=${partData.slug}&type=parts`} className="btn-primary w-full justify-center">
                  Enquire About This Part <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={`/trade/apply?part=${partData.slug}`} className="btn-secondary w-full justify-center">
                  Request Trade Pricing
                </Link>
                <Link href="/dealers" className="btn-ghost w-full justify-center text-xs">
                  Find Installation Service
                </Link>
              </div>

              {/* Warranty */}
              <p className="text-[11px] text-mid text-center pt-2 leading-relaxed">
                {partData.warranty}
              </p>
            </motion.div>
          </div>
        </div>

        {/* ── Related Parts ──────────────────────────────────── */}
        <div className="mt-20 pt-16 border-t border-dark-3">
          <SectionHeading tag="You May Also Need" title="Related Parts" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {relatedParts.map((p, i) => (
              <PartCard key={p.id} {...p} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-5 right-5 w-10 h-10 bg-dark-2 border border-dark-3 flex items-center justify-center text-light hover:text-red transition-colors"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-[4/3]"
              onClick={e => e.stopPropagation()}
            >
              <ImagePlaceholder />
            </motion.div>
            <div className="absolute bottom-6 flex gap-2">
              {partData.gallery.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setActiveImage(i) }}
                  className={`h-[3px] transition-all duration-300 ${i === activeImage ? 'w-6 bg-red' : 'w-2 bg-dark-3 hover:bg-light'}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
