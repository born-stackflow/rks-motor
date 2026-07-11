'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ModelCard } from '@/components/ui/ModelCard'
import {
  ArrowRight, ChevronLeft, ChevronDown, Check, CheckCircle,
  Download, X, Zap, Gauge, ShoppingCart, Loader2,
} from '@/components/ui/Icon'
import { formatPrice } from '@/lib/utils'
import { sanityClient, queries, urlFor } from '@/lib/sanity'
import type { BikeModelFull, FeatureHotspot, KeyFeature } from '@/lib/sanity'

const BRAND_LABELS: Record<string, string> = {
  aperyder: 'Ape Ryder', rks: 'RKS', skyjet: 'Skyjet',
}

// ── Spec grouping ─────────────────────────────────────────────────────────────
function buildSpecSections(specs: BikeModelFull['specs']) {
  const sections: Record<string, Record<string, string>> = {}

  const mb: Record<string, string> = {}
  if (specs?.motor)        mb['Motor']         = specs.motor
  if (specs?.maxSpeed)     mb['Max Speed']     = `${specs.maxSpeed} km/h`
  if (specs?.ridingModes)  mb['Riding Modes']  = specs.ridingModes
  if (specs?.range)        mb['Range']         = specs.range
  if (specs?.battery)      mb['Battery']       = specs.battery
  if (specs?.chargingTime) mb['Charging Time'] = specs.chargingTime
  if (Object.keys(mb).length) sections['Motor & Battery'] = mb

  const dl: Record<string, string> = {}
  if (specs?.displayPanel) dl['Display Panel'] = specs.displayPanel
  if (specs?.frontLight)   dl['Front Light']   = specs.frontLight
  if (specs?.rearLight)    dl['Rear Light']    = specs.rearLight
  if (Object.keys(dl).length) sections['Display & Lights'] = dl

  const sb: Record<string, string> = {}
  if (specs?.frontFork)      sb['Front Fork']      = specs.frontFork
  if (specs?.rearSuspension) sb['Rear Suspension'] = specs.rearSuspension
  if (specs?.brakes)         sb['Brakes']          = specs.brakes
  if (specs?.tires)          sb['Tires']           = specs.tires
  if (Object.keys(sb).length) sections['Suspension & Brakes'] = sb

  const dt: Record<string, string> = {}
  if (specs?.gearSystem) dt['Gear System'] = specs.gearSystem
  if (specs?.chainring)  dt['Chainring']   = specs.chainring
  if (specs?.derailleur) dt['Derailleur']  = specs.derailleur
  if (Object.keys(dt).length) sections['Drivetrain'] = dt

  const fb: Record<string, string> = {}
  if (specs?.frame)       fb['Frame']        = specs.frame
  if (specs?.saddle)      fb['Saddle']       = specs.saddle
  if (specs?.pedals)      fb['Pedals']       = specs.pedals
  if (specs?.bag)         fb['Bag / Carrier'] = specs.bag
  if (specs?.fender)      fb['Fender']       = specs.fender
  if (specs?.rearCarrier) fb['Rear Carrier'] = specs.rearCarrier
  if (specs?.weight)      fb['Weight']       = specs.weight
  if (Object.keys(fb).length) sections['Frame & Body'] = fb

  return sections
}

// ── Interactive Hotspot Section ───────────────────────────────────────────────
function HotspotSection({ imageUrl, modelName, hotspots }: {
  imageUrl: string
  modelName: string
  hotspots: FeatureHotspot[]
}) {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section className="bg-[#0d0d0d] py-20">
      <div className="container">
        <div className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.35em] text-mid mb-4">
            — {modelName} — E-BIKE
          </p>
          <h2 className="text-off-white leading-none"
              style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 7vw, 5.5rem)', letterSpacing: '0.02em' }}>
            FEATURED
          </h2>
          <h2 className="leading-none" style={{
            fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 7vw, 5.5rem)',
            letterSpacing: '0.02em', color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.12)',
          }}>
            FEATURES
          </h2>
        </div>

        <div className="relative w-full max-w-5xl mx-auto select-none">
          <Image src={imageUrl} alt={modelName} width={1200} height={750} className="w-full object-contain" priority />

          {hotspots.map((hs, i) => {
            const isActive = active === i
            return (
              <div key={i} className="absolute"
                   style={{ left: `${hs.x}%`, top: `${hs.y}%`, transform: 'translate(-50%,-50%)', zIndex: isActive ? 30 : 10 }}
                   onMouseEnter={() => setActive(i)}
                   onMouseLeave={() => setActive(null)}
                   onClick={() => setActive(isActive ? null : i)}>
                <div className="relative cursor-pointer w-5 h-5 flex items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-50" />
                  <span className="relative w-4 h-4 rounded-full bg-gold shadow-[0_0_12px_rgba(201,168,76,0.7)] block" />
                </div>
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.15 }}
                      className="absolute z-20 w-64 pointer-events-none"
                      style={{
                        left:   hs.x > 55 ? 'auto' : '28px',
                        right:  hs.x > 55 ? '28px' : 'auto',
                        top:    hs.y > 65 ? 'auto' : '28px',
                        bottom: hs.y > 65 ? '28px' : 'auto',
                      }}>
                      <div className="bg-black/95 border border-white/10 p-5">
                        {hs.label && (
                          <div className="inline-block border border-gold/50 px-2 py-0.5 mb-3">
                            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-gold/80">{hs.label}</span>
                          </div>
                        )}
                        {hs.title && (
                          <h4 className="text-off-white font-bold text-[15px] leading-tight mb-2 uppercase tracking-wide">
                            {hs.title}
                          </h4>
                        )}
                        {hs.description && (
                          <p className="text-light text-xs leading-relaxed mb-3">{hs.description}</p>
                        )}
                        {hs.highlight && (
                          <p className="text-gold font-bold text-sm tracking-wider">{hs.highlight}</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ── Key Features Showcase ─────────────────────────────────────────────────────
function KeyFeaturesSection({ features }: { features: KeyFeature[] }) {
  const [active, setActive] = useState(0)
  const current = features[active]

  return (
    <section className="bg-[#111] py-20">
      <div className="container">
        {/* Mobile: heading above */}
        <div className="mb-8 lg:hidden">
          <p className="text-[11px] uppercase tracking-[0.35em] text-mid mb-2">— Highlights</p>
          <h2 className="text-off-white leading-none"
              style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 8vw, 5rem)', letterSpacing: '0.02em' }}>
            FEATURED<br />HIGHLIGHTS
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] gap-0 border border-dark-3 overflow-hidden">

          {/* Left: numbered list */}
          <div className="bg-[#151515] flex flex-col">
            {/* Heading — desktop only */}
            <div className="hidden lg:block p-8 pb-6 border-b border-dark-3">
              <p className="text-[10px] uppercase tracking-[0.35em] text-mid mb-3">— Highlights</p>
              <h2 className="text-off-white leading-none"
                  style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.6rem', letterSpacing: '0.02em' }}>
                FEATURED<br />HIGHLIGHTS
              </h2>
            </div>

            {/* Feature list */}
            <ul className="flex-1">
              {features.map((f, i) => (
                <li key={i}>
                  <button
                    onClick={() => setActive(i)}
                    className={`w-full text-left px-8 py-5 border-b border-dark-3 transition-all duration-200 group ${
                      i === active ? 'bg-black' : 'hover:bg-black/40'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-bold font-mono transition-colors ${
                        i === active ? 'text-gold' : 'text-dark-3 group-hover:text-mid'
                      }`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className={`text-sm font-bold uppercase tracking-wider transition-colors leading-tight ${
                        i === active ? 'text-off-white' : 'text-mid group-hover:text-light'
                      }`}>
                        {f.title}
                      </span>
                    </div>
                    {i === active && (
                      <div className="h-[2px] bg-gold mt-3 w-full" style={{ marginLeft: '0' }} />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: image + info */}
          <div className="relative aspect-[4/3] lg:aspect-auto min-h-[400px] overflow-hidden bg-dark">
            <AnimatePresence mode="wait">
              <motion.div key={active}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="absolute inset-0">
                {(current?.image as any)?.asset && (
                  <Image
                    src={urlFor(current.image!).width(1200).url()}
                    alt={current.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 70vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Info overlay */}
            <AnimatePresence mode="wait">
              <motion.div key={`info-${active}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.35, ease: 'easeOut', delay: 0.1 }}
                className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-gold leading-none mb-3"
                   style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(4rem, 8vw, 6rem)', letterSpacing: '0.02em', opacity: 0.9 }}>
                  {String(active + 1).padStart(2, '0')}
                </p>
                <h3 className="text-off-white font-bold text-xl uppercase tracking-wider mb-2 leading-tight">
                  {current?.title}
                </h3>
                {current?.description && (
                  <p className="text-light text-sm leading-relaxed max-w-md">{current.description}</p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Availability map ──────────────────────────────────────────────────────────
const availabilityMap: Record<string, { label: string; variant: 'green' | 'amber' | 'red' }> = {
  'in-stock':    { label: 'In Stock',    variant: 'green' },
  'pre-order':   { label: 'Pre-Order',   variant: 'amber' },
  'coming-soon': { label: 'Coming Soon', variant: 'amber' },
  'discontinued':{ label: 'Discontinued',variant: 'red'   },
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ModelDetailPage() {
  const params = useParams()
  const slug   = params?.slug as string

  const [model,          setModel]          = useState<BikeModelFull | null>(null)
  const [loading,        setLoading]        = useState(true)
  const [activeImage,    setActiveImage]    = useState(0)
  const [selectedColour, setSelectedColour] = useState(0)
  const [lightboxOpen,   setLightboxOpen]   = useState(false)
  const [cartState,      setCartState]      = useState<'idle' | 'adding' | 'added'>('idle')
  const [lightboxImg,    setLightboxImg]    = useState('')

  useEffect(() => {
    if (!slug) return
    sanityClient.fetch(queries.modelBySlug, { slug }).then((data: BikeModelFull) => {
      setModel(data)
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-light text-sm animate-pulse">Loading…</p>
      </div>
    )
  }
  if (!model) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-light text-sm">Model not found.</p>
      </div>
    )
  }

  // ── Hero banner — only this field feeds the hero section ──
  const heroImageUrl = (model.heroImage as any)?.asset
    ? urlFor(model.heroImage!).width(2000).url()
    : ''

  // ── Product images come from colours (each colour = one product photo) ──
  // Default: show the first colour that has an image uploaded
  const selectedColor   = model.colours?.[selectedColour]
  const colorImageUrl   = (selectedColor?.image as any)?.asset
    ? urlFor(selectedColor!.image!).width(1400).url()
    : null
  // Fallback to first colour that has any image
  const firstColourWithImage = model.colours?.find((c: any) => c?.image?.asset)
  const fallbackProductImage = firstColourWithImage && !(selectedColor?.image as any)?.asset
    ? urlFor((firstColourWithImage as any).image).width(1400).url()
    : null
  const productImage = colorImageUrl || fallbackProductImage || ''

  // ── Extra gallery shots (angle shots, optional) ──
  const gallery: string[] = (model.gallery ?? [])
    .filter((img: any) => img?.asset)
    .map(img => urlFor(img).width(1400).url())
  const currentImg = gallery[activeImage] || ''

  // For lightbox: show colour image if selected, else gallery image
  const displayImage = colorImageUrl || currentImg || productImage

  // ── Hotspot image (dedicated field, falls back to productImage) ──
  const hotspotImgUrl = (model.hotspotImage as any)?.asset
    ? urlFor(model.hotspotImage!).width(1600).url()
    : productImage || gallery[0] || ''

  const specSections    = buildSpecSections(model.specs)
  const specSectionKeys = Object.keys(specSections)
  const relatedModels   = model.sameBrandModels ?? []
  const brandLabel      = BRAND_LABELS[model.category ?? ''] ?? model.category ?? ''
  const avail           = availabilityMap[model.availability ?? ''] ?? { label: model.availability ?? '', variant: 'amber' as const }

  const handleAddToCart = () => {
    if (cartState !== 'idle') return
    setCartState('adding')
    setTimeout(() => {
      const cart = JSON.parse(localStorage.getItem('rks-cart') || '[]')
      const exists = cart.some((i: any) => i._id === model._id)
      if (!exists) {
        cart.push({ _id: model._id, name: model.name, slug, price: model.price, image: gallery[0] ?? null, qty: 1 })
        localStorage.setItem('rks-cart', JSON.stringify(cart))
      }
      setCartState('added')
      setTimeout(() => setCartState('idle'), 3200)
    }, 650)
  }

  return (
    <div className="min-h-screen bg-black">

      {/* ════════════════════════════════════════════════════════════
          1. HERO — full-bleed with model name at bottom
      ════════════════════════════════════════════════════════════ */}
      <section className="relative h-[88vh] min-h-[580px] overflow-hidden">
        {heroImageUrl && (
          <Image src={heroImageUrl} alt={model.name} fill priority
                 sizes="100vw" className="object-cover object-center" />
        )}
        {/* Gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute top-6 left-0 right-0">
          <div className="container">
            <Link href="/models" className="inline-flex items-center gap-1 text-xs text-light hover:text-red transition-colors uppercase tracking-widest font-semibold">
              <ChevronLeft className="h-3 w-3" /> Models
            </Link>
          </div>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container pb-14">
            {/* Brand + category */}
            <p className="text-red text-[11px] font-bold uppercase tracking-[0.4em] mb-2">
              {brandLabel} — E-BIKE
            </p>

            {/* Model name */}
            <h1 className="text-off-white leading-none mb-6"
                style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(4rem, 13vw, 10rem)', letterSpacing: '0.02em' }}>
              {model.name}
            </h1>

            {/* Quick stats strip */}
            <div className="flex flex-wrap gap-8 mb-8">
              {[
                { icon: <Zap className="h-4 w-4 text-red" />,   label: 'Motor',     val: model.specs?.motor },
                { icon: <Gauge className="h-4 w-4 text-red" />, label: 'Max Speed', val: model.specs?.maxSpeed ? `${model.specs.maxSpeed} km/h` : undefined },
                { icon: <Zap className="h-4 w-4 text-gold" />,  label: 'Range',     val: model.specs?.range },
                { icon: <Zap className="h-4 w-4 text-gold" />,  label: 'Battery',   val: model.specs?.battery },
              ].filter(s => s.val).map(({ icon, label, val }) => (
                <div key={label} className="flex items-center gap-3 border-l-2 border-red pl-4">
                  {icon}
                  <div>
                    <p className="text-[9px] text-mid uppercase tracking-[0.2em]">{label}</p>
                    <p className="text-off-white font-bold text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll hint */}
            <div className="flex items-center gap-2 text-mid text-[10px] uppercase tracking-widest animate-bounce">
              <ChevronDown className="h-4 w-4" />
              Scroll to explore
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          2. PRODUCT DETAIL — gallery + purchase panel
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-black py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-12">

            {/* Product image + colour switcher */}
            <div>
              {/* Main product image — driven by colour selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="relative aspect-[16/10] overflow-hidden bg-dark cursor-zoom-in group"
                onClick={() => { if (productImage) { setLightboxImg(productImage); setLightboxOpen(true) } }}>
                <AnimatePresence mode="wait">
                  {productImage ? (
                    <motion.div key={`product-${selectedColour}`}
                      initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0">
                      <Image src={productImage} alt={model.name} fill priority
                             sizes="(max-width: 1024px) 100vw, 60vw"
                             className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
                    </motion.div>
                  ) : (
                    <motion.div key="placeholder" className="absolute inset-0 flex items-center justify-center">
                      <p className="text-mid text-xs uppercase tracking-widest">Upload product images via Colours in Studio</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                {/* Active colour label */}
                {selectedColor && (
                  <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/70 px-3 py-1.5 backdrop-blur-sm border border-white/10">
                    {selectedColor.hex && (
                      <span className="w-3 h-3 rounded-full border border-white/30"
                            style={{ backgroundColor: selectedColor.hex }} />
                    )}
                    <span className="text-[10px] text-off-white uppercase tracking-widest font-bold">
                      {selectedColor.name}
                    </span>
                  </div>
                )}
                {productImage && (
                  <div className="absolute top-3 right-3 bg-black/60 px-2 py-1 text-[10px] text-mid uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to enlarge
                  </div>
                )}
              </motion.div>

              {/* Colour thumbnail strip — each swatch shows that colour's bike photo */}
              {model.colours && model.colours.length > 0 && (
                <div className="mt-3">
                  <p className="text-[9px] text-mid uppercase tracking-[0.25em] mb-2">
                    Select Colour — <span className="text-off-white">{selectedColor?.name ?? ''}</span>
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {model.colours.map((c, i) => {
                      const thumbUrl = (c.image as any)?.asset
                        ? urlFor(c.image!).width(120).url()
                        : null
                      const isActive = i === selectedColour
                      return (
                        <button
                          key={i}
                          title={c.name}
                          onClick={() => setSelectedColour(i)}
                          className={`relative w-16 h-12 overflow-hidden border-2 transition-all ${
                            isActive ? 'border-red shadow-[0_0_8px_rgba(204,0,0,0.4)]' : 'border-dark-3 opacity-60 hover:opacity-100 hover:border-red/50'
                          }`}
                        >
                          {thumbUrl ? (
                            <Image src={thumbUrl} alt={c.name} fill className="object-cover" />
                          ) : (
                            <div className="absolute inset-0" style={{ backgroundColor: c.hex ?? '#333' }} />
                          )}
                          {isActive && (
                            <div className="absolute inset-0 border-[2px] border-red pointer-events-none" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Extra gallery shots (if uploaded) */}
              {gallery.length > 0 && (
                <div className="mt-5">
                  <p className="text-[9px] text-mid uppercase tracking-[0.25em] mb-2">Gallery</p>
                  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(gallery.length, 6)}, 1fr)` }}>
                    {gallery.map((img, i) => (
                      <button key={i} onClick={() => { setActiveImage(i); setLightboxImg(img); setLightboxOpen(true) }}
                              className="relative aspect-[4/3] overflow-hidden border border-dark-3 opacity-70 hover:opacity-100 transition-opacity">
                        <Image src={img} alt={`${model.name} ${i + 1}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Purchase Panel ── */}
            <div className="lg:sticky lg:top-[88px] h-fit space-y-4">

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="red">{brandLabel}</Badge>
                {model.isNew && <Badge variant="gold">NEW</Badge>}
                <Badge variant={avail.variant}>{avail.label}</Badge>
              </div>

              {/* Name */}
              <h2 className="text-off-white leading-none"
                  style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.2rem, 4vw, 3rem)', letterSpacing: '0.02em' }}>
                {model.name}
              </h2>
              {model.tagline && <p className="text-light text-sm italic">{model.tagline}</p>}

              {/* ── Price card ── */}
              <div className="bg-dark border border-dark-3 p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-mid mb-2">Price</p>
                {model.price ? (
                  <>
                    <p className="text-gold leading-none mb-2"
                       style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.8rem, 6vw, 4rem)' }}>
                      {formatPrice(model.price)}
                    </p>
                    <p className="text-xs text-mid leading-relaxed">
                      {model.b2cPriceNote ?? 'RRP · VAT included · Contact dealer for final pricing'}
                    </p>
                  </>
                ) : (
                  <p className="text-xl text-light">Contact for price</p>
                )}
              </div>

              {/* ── CTA Buttons ── */}
              <div className="flex flex-col gap-3 pt-1">

                {/* Add to Cart — animated state machine */}
                <motion.button
                  onClick={handleAddToCart}
                  disabled={cartState !== 'idle'}
                  whileTap={cartState === 'idle' ? { scale: 0.97 } : {}}
                  className={`relative w-full flex items-center justify-center h-[52px] font-bold text-sm uppercase tracking-widest overflow-hidden transition-colors duration-500 ${
                    cartState === 'added'
                      ? 'bg-green-700 text-white border border-green-600'
                      : cartState === 'adding'
                      ? 'bg-red/70 text-white border border-red/50 cursor-not-allowed'
                      : 'bg-red text-white border border-red hover:bg-[#aa0000] cursor-pointer'
                  }`}
                >
                  {/* Ripple on adding */}
                  {cartState === 'adding' && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0.5 }}
                      animate={{ scale: 6, opacity: 0 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-white pointer-events-none"
                    />
                  )}

                  {/* Countdown drain bar when added */}
                  {cartState === 'added' && (
                    <motion.span
                      initial={{ scaleX: 1 }}
                      animate={{ scaleX: 0 }}
                      transition={{ duration: 3.2, ease: 'linear' }}
                      style={{ originX: 0 }}
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/25 pointer-events-none"
                    />
                  )}

                  <AnimatePresence mode="wait">
                    {cartState === 'idle' && (
                      <motion.span key="idle" className="flex items-center gap-3"
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                        <ShoppingCart className="h-5 w-5" />
                        Add to Cart
                      </motion.span>
                    )}
                    {cartState === 'adding' && (
                      <motion.span key="adding" className="flex items-center gap-3"
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Adding…
                      </motion.span>
                    )}
                    {cartState === 'added' && (
                      <motion.span key="added" className="flex items-center gap-3"
                        initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                        <CheckCircle className="h-5 w-5" />
                        Added to Cart!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <Link href={`/contact?model=${slug}&type=purchase`} className="btn-secondary w-full justify-center">
                  Enquire Now <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={`/contact?model=${slug}&type=test-ride`} className="btn-ghost w-full justify-center text-xs">
                  Book a Test Ride
                </Link>
              </div>

              {/* Warranty */}
              <div className="border-t border-dark-3 pt-4 grid grid-cols-2 gap-3">
                {[
                  { icon: '🛡️', text: '2-Year Warranty' },
                  { icon: '🚚', text: 'Fast Shipping' },
                  { icon: '↩️', text: '30-Day Returns' },
                  { icon: '🔧', text: 'Service Support' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-[11px] text-mid">
                    <span>{icon}</span>
                    <span className="uppercase tracking-wider">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          3. GALLERY — full grid of additional photos
      ════════════════════════════════════════════════════════════ */}
      {gallery.length > 1 && (
        <section className="bg-[#0a0a0a] py-14">
          <div className="container">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-mid mb-6">Gallery</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {gallery.map((img, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  onClick={() => { setActiveImage(i); setLightboxImg(img); setLightboxOpen(true) }}
                  className="relative aspect-[4/3] overflow-hidden bg-dark group cursor-zoom-in"
                >
                  <Image src={img} alt={`${model.name} photo ${i + 1}`} fill
                         sizes="(max-width: 768px) 50vw, 25vw"
                         className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          5. TECHNICAL SPECIFICATIONS — full table, no tabs
      ════════════════════════════════════════════════════════════ */}
      {specSectionKeys.length > 0 && (
        <section className="bg-dark py-20">
          <div className="container">
            <SectionHeading tag="E-Bike Details" title="Technical Specifications" />
            <div className="mt-10 border border-dark-3 overflow-hidden">
              {Object.entries(specSections).map(([section, rows]) => (
                <div key={section}>
                  {/* Category header row */}
                  <div className="flex items-center gap-3 bg-dark-3 px-6 py-3 border-b border-dark-3">
                    <div className="w-1.5 h-4 bg-red shrink-0" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-red">{section}</span>
                  </div>
                  {/* Spec rows */}
                  {Object.entries(rows).map(([label, value], i) => (
                    <div key={label} className={`flex items-center border-b border-dark-3 last:border-0 ${i % 2 === 0 ? 'bg-black' : 'bg-dark'}`}>
                      <span className="w-1/2 px-6 py-4 text-sm text-light uppercase tracking-wide border-r border-dark-3">
                        {label}
                      </span>
                      <span className="w-1/2 px-6 py-4 text-sm text-off-white font-medium"
                            style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {model.specSheetPDF && (
              <div className="mt-6">
                <a href={(model.specSheetPDF as any).asset?.url} target="_blank" rel="noopener noreferrer"
                   className="btn-ghost text-sm">
                  <Download className="h-4 w-4" /> Download Full Spec Sheet (PDF)
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          6a. INTERACTIVE HOTSPOTS
      ════════════════════════════════════════════════════════════ */}
      {model.hotspots && model.hotspots.length > 0 && hotspotImgUrl && (
        <HotspotSection imageUrl={hotspotImgUrl} modelName={model.name} hotspots={model.hotspots} />
      )}

      {/* ════════════════════════════════════════════════════════════
          6. KEY FEATURE SHOWCASE (image + numbered list)
      ════════════════════════════════════════════════════════════ */}
      {model.keyFeatures && model.keyFeatures.length > 0 && (
        <KeyFeaturesSection features={model.keyFeatures} />
      )}

      {/* Fallback: simple text features if no keyFeatures images uploaded */}
      {(!model.keyFeatures || model.keyFeatures.length === 0) && model.features && model.features.length > 0 && (
        <section className="bg-black py-20">
          <div className="container">
            <SectionHeading tag="What's Included" title="Standard Features" />
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-dark-3">
              {model.features.map((f) => (
                <div key={f}
                     className="flex items-center gap-4 p-5 border-b border-r border-dark-3 hover:bg-dark transition-colors">
                  <div className="w-8 h-8 bg-red/10 border border-red/30 flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-red" />
                  </div>
                  <span className="text-sm text-off-white leading-snug">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          6. SAME-BRAND MODELS
      ════════════════════════════════════════════════════════════ */}
      {relatedModels.length > 0 && (
        <section className="bg-dark py-20">
          <div className="container">
            <SectionHeading tag="More from this Brand" title={`Other ${brandLabel} Models`} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {relatedModels.map((m, i) => (
                <ModelCard
                  key={m._id}
                  name={m.name}
                  slug={typeof m.slug === 'string' ? m.slug : (m.slug as any)?.current ?? ''}
                  category={BRAND_LABELS[m.category] ?? m.category}
                  price={m.price}
                  tagline={m.tagline}
                  image={(m as any).thumbnailImage?.asset ? urlFor((m as any).thumbnailImage).width(800).url() : (m.heroImage as any)?.asset ? urlFor(m.heroImage!).width(800).url() : undefined}
                  isNew={m.isNew}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          FLOATING CART TOAST
      ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {cartState === 'added' && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="fixed bottom-6 right-6 z-[60] flex items-stretch overflow-hidden shadow-2xl border border-dark-3 max-w-[320px]"
            style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)' }}
          >
            {/* Coloured left bar */}
            <div className="w-1 bg-green-600 shrink-0" />

            {/* Thumbnail */}
            {gallery[0] && (
              <div className="relative w-20 bg-black shrink-0">
                <Image src={gallery[0]} alt={model.name} fill className="object-cover" />
              </div>
            )}

            {/* Info */}
            <div className="flex-1 bg-[#141414] px-4 py-3 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-3.5 h-3.5 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                  <Check className="h-2 w-2 text-white" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-green-400">Added to Cart</span>
              </div>
              <p className="text-off-white font-bold text-sm leading-tight truncate"
                 style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.04em', fontSize: '1.1rem' }}>
                {model.name}
              </p>
              {model.price && (
                <p className="text-gold text-xs font-mono mt-0.5">{formatPrice(model.price)}</p>
              )}
            </div>

            {/* View Cart CTA */}
            <Link href="/cart"
                  className="flex items-center px-4 bg-red hover:bg-[#aa0000] transition-colors text-white text-[10px] font-bold uppercase tracking-widest shrink-0 whitespace-nowrap">
              View<br />Cart →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════
          LIGHTBOX
      ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {lightboxOpen && lightboxImg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 bg-black/96 flex items-center justify-center p-4"
                      onClick={() => setLightboxOpen(false)}>
            <button
              className="absolute top-5 right-5 w-10 h-10 bg-dark-2 border border-dark-3 flex items-center justify-center text-light hover:text-red transition-colors"
              onClick={() => setLightboxOpen(false)}>
              <X className="h-5 w-5" />
            </button>

            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-5xl aspect-[16/10]"
                        onClick={e => e.stopPropagation()}>
              <Image src={lightboxImg} alt={model.name} fill className="object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
