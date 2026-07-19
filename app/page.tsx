'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { HeroSlider } from '@/components/hero/HeroSlider'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StatCounter } from '@/components/ui/StatCounter'
import { ModelCard } from '@/components/ui/ModelCard'
import { PartCard } from '@/components/ui/PartCard'
import { ArrowRight, Zap, Award, Globe, Wrench, Building2 } from '@/components/ui/Icon'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { useLanguage } from '@/contexts/LanguageContext'
import { sanityClient, queries, urlFor } from '@/lib/sanity'
import type { BikeModelCard, BikePartCard, BlogPostCard, SiteSettings, PartCategorySummary } from '@/lib/sanity'

const BRAND_LABELS: Record<string, string> = {
  aperyder: 'Ape Ryder',
  rks:      'RKS',
  skyjet:   'Skyjet',
}

const whyIcons = [
  <Award className="h-8 w-8" key="award" />,
  <Zap className="h-8 w-8" key="zap" />,
  <Wrench className="h-8 w-8" key="wrench" />,
  <Globe className="h-8 w-8" key="globe" />,
]

// ── Marquee strip items ──────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  '⚡ Zero Emissions',
  '🔋 100km+ Range',
  '⚡ Smart Motor Control',
  '🔋 Fast Charging',
  '⚡ Shimano Gears',
  '🔋 48V Battery System',
  '⚡ LED Dashboard',
  '🔋 Hydraulic Disc Brakes',
  '⚡ Alloy Frame',
  '🔋 Regenerative Braking',
  '⚡ App Connected',
  '🔋 Italian Design',
]

function Marquee() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div className="relative overflow-hidden bg-black border-y border-dark-3 py-3 select-none">
      <motion.div
        className="flex gap-10 whitespace-nowrap w-max"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="text-xs font-semibold uppercase tracking-[0.2em] text-light flex-shrink-0">
            {item}
          </span>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-10" />
    </div>
  )
}

// ── Parallax section wrapper ─────────────────────────────────────────────────
function ParallaxBg({ src, alt, opacity = 0.12 }: { src?: string; alt: string; opacity?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  if (!src) return null
  return (
    <motion.div ref={ref} className="absolute inset-0 overflow-hidden" style={{ y }}>
      <Image src={src} alt={alt} fill className="object-cover object-center" style={{ opacity }} />
    </motion.div>
  )
}

// ── Tilt card wrapper ────────────────────────────────────────────────────────
function TiltCard({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14
    el.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.02,1.02,1.02)`
  }
  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.2s ease', willChange: 'transform' }}
    >
      {children}
    </motion.div>
  )
}

// ── Electric pulse badge ─────────────────────────────────────────────────────
function ElectricBadge({ label }: { label: string }) {
  return (
    <motion.div
      className="inline-flex items-center gap-2 mb-4"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-2 h-2 rounded-full bg-red"
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-red">{label}</span>
    </motion.div>
  )
}

// ── Animated counter section ─────────────────────────────────────────────────
function AnimatedStat({ value, label, index }: { value: string; label: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="text-center group relative"
    >
      <motion.div
        className="absolute inset-0 bg-white/5 rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        layoutId={`stat-bg-${index}`}
      />
      <motion.p
        className="text-4xl md:text-5xl font-black text-white mb-1 relative z-10"
        style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.04em' }}
        initial={{ scale: 0.5 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.1, type: 'spring', stiffness: 200 }}
      >
        {value}
      </motion.p>
      <p className="text-xs uppercase tracking-[0.15em] text-white/70 font-semibold relative z-10">{label}</p>
    </motion.div>
  )
}

export default function HomePage() {
  const { t } = useLanguage()
  const h = t.home

  const [featuredModels,  setFeaturedModels]  = useState<BikeModelCard[]>([])
  const [featuredParts,   setFeaturedParts]   = useState<BikePartCard[]>([])
  const [latestPosts,     setLatestPosts]     = useState<BlogPostCard[]>([])
  const [siteSettings,    setSiteSettings]    = useState<SiteSettings | null>(null)
  const [partCategorySummary, setPartCategorySummary] = useState<PartCategorySummary | null>(null)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    sanityClient.fetch(queries.featuredModels).then((data: BikeModelCard[]) => setFeaturedModels(data ?? []))
    sanityClient.fetch(queries.featuredParts).then((data: BikePartCard[]) => setFeaturedParts(data ?? []))
    sanityClient.fetch(queries.latestPosts).then((data: BlogPostCard[]) => setLatestPosts((data ?? []).slice(0, 3)))
    sanityClient.fetch(queries.siteSettings).then((data: SiteSettings) => setSiteSettings(data ?? null))
    sanityClient.fetch(queries.partCategorySummary).then((data: PartCategorySummary) => setPartCategorySummary(data ?? null))
  }, [])

  // Helper: resolve CMS image to URL, or return undefined (falls back to hardcoded)
  const cmsBg = (field: keyof SiteSettings): string | undefined => {
    const val = siteSettings?.[field]
    return val && (val as any)?.asset ? urlFor(val as any).width(1920).quality(85).url() : undefined
  }

  // Hero slide CMS backgrounds (index-matched to the 5 translation slides)
  const heroCmsBgs = [
    cmsBg('heroSlide1Bg'),
    cmsBg('heroSlide2Bg'),
    cmsBg('heroSlide3Bg'),
    cmsBg('heroSlide4Bg'),
    cmsBg('heroSlide5Bg'),
  ]

  // Hero slide CMS foreground product images
  const heroCmsFgs = [
    cmsBg('heroSlide1Fg'),
    cmsBg('heroSlide2Fg'),
    cmsBg('heroSlide3Fg'),
    cmsBg('heroSlide4Fg'),
    cmsBg('heroSlide5Fg'),
  ]

  return (
    <div className="bg-black">

      {/* ── Hero ────────────────────────────────────────────── */}
      <HeroSlider cmsBgs={heroCmsBgs} cmsFgs={heroCmsFgs} />

      {/* ── Electric Marquee ────────────────────────────────── */}
      <Marquee />

      {/* ── Stats bar ───────────────────────────────────────── */}
      <section className="relative py-10 overflow-hidden">
        <div className="absolute inset-0 bg-red">
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.1) 60px, rgba(255,255,255,0.1) 61px)',
            }}
            animate={{ x: ['0px', '61px'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <div className="container relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/20">
            {h.stats.map((stat, i) => (
              <AnimatedStat key={i} value={stat.value} label={stat.label} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured E-Bike Models ──────────────────────────── */}
      <section className="section bg-black relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />
        <div className="container relative">
          <div className="flex items-end justify-between mb-12">
            <div>
              <ElectricBadge label={h.models.tag} />
              <motion.h2
                className="text-off-white leading-none"
                style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {h.models.title}
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/models" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-light hover:text-red transition-colors group">
                {h.models.viewAll}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {featuredModels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredModels.slice(0, 3).map((m, i) => (
                <TiltCard key={m._id} index={i}>
                  <ModelCard
                    name={m.name}
                    slug={m.slug?.current ?? ''}
                    category={BRAND_LABELS[m.category] ?? m.category}
                    price={m.price}
                    tagline={m.tagline}
                    image={(m.heroImage as any)?.asset ? urlFor(m.heroImage!).width(800).url() : undefined}
                    isNew={m.isNew}
                    isFeatured={m.isFeatured}
                    index={0}
                  />
                </TiltCard>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map(i => (
                <div key={i} className="card aspect-[16/10] animate-pulse bg-dark-2" />
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link href="/models" className="btn-secondary">{h.models.viewAllModels}</Link>
          </div>
        </div>
      </section>

      {/* ── E-Bike Parts Teaser ─────────────────────────────── */}
      <section className="section relative overflow-hidden bg-dark">
        <ParallaxBg
          src={cmsBg('partsSectionBg')}
          alt="E-bike parts"
          opacity={0.08}
        />
        {/* Animated electric grid lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-red/10"
              style={{ left: `${(i + 1) * 20}%` }}
              animate={{ opacity: [0.05, 0.2, 0.05] }}
              transition={{ duration: 3, delay: i * 0.6, repeat: Infinity }}
            />
          ))}
        </div>

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <ElectricBadge label={h.parts.tag} />
              <h2
                className="text-off-white leading-none mb-4"
                style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
              >
                {h.parts.title}
              </h2>
              <p className="text-light text-base leading-relaxed mb-8 max-w-md">{h.parts.subtitle}</p>

              {/* Mini feature list */}
              <div className="space-y-3 mb-8">
                {['OEM Genuine Parts', 'Fast UK Dispatch', 'Expert Tech Support', '2-Year Warranty'].map((feat, i) => (
                  <motion.div
                    key={feat}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i + 0.3, duration: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-4 h-4 border border-red/50 bg-red/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-1.5 h-1.5 bg-red rounded-full" />
                    </div>
                    <span className="text-sm text-light">{feat}</span>
                  </motion.div>
                ))}
              </div>

              <Link href="/parts" className="btn-primary group inline-flex items-center gap-2">
                {h.parts.browse}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Right — 2×2 category grid */}
            <div className="grid grid-cols-2 gap-3">
              {h.parts.categories.map((cat, i) => {
                const catKey = cat.href.split('category=')[1] as keyof PartCategorySummary | undefined
                const summary = catKey ? partCategorySummary?.[catKey] : undefined
                const cmsImage = (summary?.image as any)?.asset ? urlFor(summary!.image!).width(600).quality(80).url() : undefined
                const count = summary?.count ?? 0
                return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Link href={cat.href} className="group relative block aspect-square overflow-hidden bg-dark-3">
                    {cmsImage ? (
                      <Image
                        src={cmsImage} alt={cat.title} fill
                        className="object-cover opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700"
                      />
                    ) : (
                      <ImagePlaceholder className="opacity-70 group-hover:opacity-90 transition-opacity duration-700" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {/* Electric border on hover */}
                    <div className="absolute inset-0 border border-transparent group-hover:border-red/40 transition-colors duration-300" />
                    <div className="absolute bottom-0 left-0 p-4">
                      <p className="text-off-white font-bold text-sm uppercase tracking-wide group-hover:text-red transition-colors">{cat.title}</p>
                      <p className="text-light/60 text-xs mt-0.5">{count} parts</p>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <div className="w-7 h-7 bg-red flex items-center justify-center">
                        <ArrowRight className="h-3.5 w-3.5 text-white" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured E-Bike Parts ───────────────────────────── */}
      <section className="section bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)', backgroundSize: '40px 40px' }}
        />
        <div className="container relative">
          <div className="flex items-end justify-between mb-12">
            <div>
              <ElectricBadge label={h.parts.shopTag} />
              <motion.h2
                className="text-off-white leading-none"
                style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {h.parts.popularTitle}
              </motion.h2>
            </div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <Link href="/parts" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-light hover:text-red transition-colors group">
                {h.parts.allParts} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {featuredParts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredParts.slice(0, 3).map((p, i) => (
                <TiltCard key={p._id} index={i}>
                  <PartCard
                    name={p.name}
                    slug={(p.slug as any)?.current ?? ''}
                    partNumber={p.partNumber}
                    category={p.category}
                    price={p.retailPrice}
                    availability={p.availability as 'in-stock' | 'order-required' | 'out-of-stock' | undefined}
                    image={(p.image as any)?.asset ? urlFor(p.image!).width(800).url() : undefined}
                    compatibleCount={p.compatibleModels?.length}
                    isOEM
                    index={0}
                  />
                </TiltCard>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map(i => <div key={i} className="card aspect-[4/3] animate-pulse bg-dark-2" />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Why Choose RKS ─────────────────────────────────── */}
      <section className="section relative overflow-hidden bg-dark">
        <ParallaxBg
          src={cmsBg('whySectionBg')}
          alt="E-bike technology"
          opacity={0.05}
        />
        {/* Animated radial glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(204,0,0,0.06) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="container relative">
          <div className="text-center mb-14">
            <ElectricBadge label={h.why.tag} />
            <motion.h2
              className="text-off-white leading-none mb-4"
              style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {h.why.title}
            </motion.h2>
            <motion.p
              className="text-light max-w-xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {h.why.subtitle}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {h.why.items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className="relative card p-6 group overflow-hidden cursor-default"
              >
                {/* Animated corner accent */}
                <div className="absolute top-0 left-0 w-0 h-[2px] bg-red group-hover:w-full transition-all duration-500" />
                <div className="absolute top-0 right-0 w-[2px] h-0 bg-red group-hover:h-full transition-all duration-500 delay-100" />

                <motion.div
                  className="text-red mb-5 w-12 h-12 bg-red/10 flex items-center justify-center"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  {whyIcons[i]}
                </motion.div>
                <h3 className="text-off-white font-bold text-base mb-2 group-hover:text-red transition-colors">{item.title}</h3>
                <p className="text-light text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest News ────────────────────────────────────── */}
      <section className="section bg-black relative overflow-hidden">
        <div className="container relative">
          <div className="flex items-end justify-between mb-12">
            <div>
              <ElectricBadge label={h.newsSection.tag} />
              <motion.h2
                className="text-off-white leading-none"
                style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {h.newsSection.title}
              </motion.h2>
            </div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <Link href="/news" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-light hover:text-red transition-colors group">
                {h.newsSection.allNews} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestPosts.map((article, i) => (
                <motion.div
                  key={article._id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  whileHover={{ y: -4 }}
                >
                  <Link href={`/news/${(article.slug as any)?.current ?? ''}`} className="group block h-full">
                    <div className="card overflow-hidden h-full flex flex-col group-hover:border-red/40 transition-colors duration-300">
                      <div className="relative aspect-[16/9] overflow-hidden bg-dark-2">
                        {(article.featuredImage as any)?.asset ? (
                          <Image
                            src={urlFor(article.featuredImage!).width(900).url()}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-dark-2 flex items-center justify-center">
                            <Zap className="h-10 w-10 text-dark-3" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-3 left-3">
                          <span className="badge bg-red/20 text-red border border-red/40 text-xs">{article.category}</span>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <p className="text-xs text-mid mb-2">
                          {article.publishedDate
                            ? new Date(article.publishedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                            : ''}
                        </p>
                        <h3 className="font-bold text-off-white mb-2 leading-snug group-hover:text-red transition-colors">{article.title}</h3>
                        <p className="text-sm text-light leading-relaxed flex-1">{article.excerpt}</p>
                        <div className="flex items-center gap-1.5 mt-4 text-sm font-semibold text-red group-hover:gap-3 transition-all">
                          {h.newsSection.readMore} <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map(i => <div key={i} className="card h-72 animate-pulse bg-dark-2" />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Dealer Teaser ──────────────────────────────────── */}
      <section className="section-sm bg-dark relative overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden border border-dark-3">
            {/* Map side */}
            <div className="relative h-64 lg:h-auto min-h-[320px] overflow-hidden">
              {cmsBg('dealerSectionBg') ? (
                <Image
                  src={cmsBg('dealerSectionBg')!}
                  alt="Find a dealer"
                  fill
                  className="object-cover object-center"
                />
              ) : (
                <ImagePlaceholder icon={Globe} />
              )}
              <div className="absolute inset-0 bg-black/50" />
              {/* Animated pulse pins */}
              {[
                { top: '35%', left: '45%' },
                { top: '55%', left: '30%' },
                { top: '25%', left: '65%' },
              ].map((pos, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{ top: pos.top, left: pos.left }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.3 + 0.4 }}
                >
                  <motion.div
                    className="w-3 h-3 bg-red rounded-full"
                    animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.7 }}
                  />
                  <motion.div
                    className="absolute inset-0 border-2 border-red rounded-full"
                    animate={{ scale: [1, 3], opacity: [0.6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.7 }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Text side */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="bg-dark-2 p-10 lg:p-14 flex flex-col justify-center"
            >
              <ElectricBadge label={h.dealer.locations} />
              <h2 className="text-4xl md:text-5xl text-off-white mb-4 leading-none" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                {h.dealer.title}
              </h2>
              <p className="text-light text-base mb-8 max-w-sm leading-relaxed">{h.dealer.desc}</p>
              <Link href="/dealers" className="btn-primary self-start group inline-flex items-center gap-2">
                {h.dealer.cta} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── B2B Callout ────────────────────────────────────── */}
      <section className="relative py-16 md:py-20 overflow-hidden bg-black">

        {/* ── E-bike background image ── */}
        <div className="absolute inset-0">
          {cmsBg('b2bSectionBg') ? (
            <Image
              src={cmsBg('b2bSectionBg')!}
              alt="E-bike background"
              fill
              className="object-cover object-center"
            />
          ) : (
            <ImagePlaceholder icon={Building2} />
          )}
        </div>
        {/* Dark overlay to keep text readable */}
        <div className="absolute inset-0 bg-black/75" />

        {/* ── Deep red radial glow — bottom-left, exactly like the reference ── */}
        <motion.div
          className="absolute -bottom-32 -left-32 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(180,0,0,0.55) 0%, rgba(120,0,0,0.25) 35%, transparent 70%)' }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* secondary softer glow slightly higher */}
        <motion.div
          className="absolute top-0 left-0 w-[500px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 0% 100%, rgba(140,0,0,0.18) 0%, transparent 65%)' }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        {/* ── Animated horizontal scanlines ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px w-full"
              style={{
                top: `${18 + i * 22}%`,
                background: 'linear-gradient(90deg, transparent 0%, rgba(204,0,0,0.12) 30%, rgba(204,0,0,0.06) 70%, transparent 100%)',
              }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 7 + i * 1.5, repeat: Infinity, ease: 'linear', delay: i * 1.2 }}
            />
          ))}
        </div>

        {/* ── Subtle dot grid ── */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />

        {/* ── Animated vertical accent line (draws down on scroll) ── */}
        <motion.div
          className="absolute left-[calc((100vw-1280px)/2)] top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-red to-transparent hidden xl:block"
          initial={{ scaleY: 0, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ originY: 0 }}
        />

        <div className="container relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-16">

            {/* ── LEFT — label + title + body ── */}
            <div className="flex gap-6 items-stretch max-w-2xl">

              {/* Animated vertical red bar */}
              <motion.div
                className="w-[3px] flex-shrink-0 bg-red self-stretch rounded-full"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                style={{ originY: 0 }}
              />

              <div>
                {/* Icon + label row */}
                <motion.div
                  className="flex items-center gap-2.5 mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <motion.div
                    className="w-8 h-8 bg-red/10 border border-red/30 flex items-center justify-center flex-shrink-0"
                    animate={{ borderColor: ['rgba(204,0,0,0.3)', 'rgba(204,0,0,0.9)', 'rgba(204,0,0,0.3)'] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <Building2 className="h-4 w-4 text-red" />
                  </motion.div>
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-red">{h.b2b.label}</span>
                </motion.div>

                {/* Title — word-by-word stagger */}
                <div className="overflow-hidden mb-4">
                  <motion.h2
                    className="text-off-white leading-none"
                    style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', letterSpacing: '0.02em' }}
                    initial={{ y: 60, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {h.b2b.title}
                  </motion.h2>
                </div>

                {/* Body */}
                <motion.p
                  className="text-light text-sm md:text-base leading-relaxed max-w-lg"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                >
                  {h.b2b.desc}
                </motion.p>

                {/* Mobile CTAs (shown below md) */}
                <motion.div
                  className="flex flex-wrap gap-3 mt-7 lg:hidden"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.55 }}
                >
                  <Link href="/trade/apply" className="btn-primary group inline-flex items-center gap-2">
                    {h.b2b.cta}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/trade" className="btn-secondary">Learn More</Link>
                </motion.div>
              </div>
            </div>

            {/* ── RIGHT — prominent CTA button (desktop only) ── */}
            <motion.div
              className="hidden lg:flex flex-col items-end gap-4 flex-shrink-0"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Primary CTA — large, glowing */}
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="relative">
                {/* Glow behind button */}
                <motion.div
                  className="absolute inset-0 blur-xl rounded-none"
                  style={{ background: 'rgba(204,0,0,0.35)' }}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
                <Link
                  href="/trade/apply"
                  className="relative z-10 flex items-center gap-4 bg-red hover:bg-red/90 text-white font-bold text-sm uppercase tracking-[0.18em] px-10 py-5 transition-colors duration-200 group"
                >
                  {h.b2b.cta}
                  <motion.span
                    className="flex items-center"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </Link>
              </motion.div>

              {/* Secondary text link */}
              <Link
                href="/trade"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-light hover:text-red transition-colors duration-200 flex items-center gap-1.5 group"
              >
                Learn More
                <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Newsletter ─────────────────────────────────────── */}
      <section className="section-sm bg-black border-t border-dark-3 relative overflow-hidden">
        {/* Animated background lines */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-red/20 to-transparent w-full"
              style={{ top: `${30 + i * 20}%` }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'linear', delay: i * 1.5 }}
            />
          ))}
        </div>

        <div className="max-w-xl mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Zap icon */}
            <motion.div
              className="w-14 h-14 bg-red/10 border border-red/30 flex items-center justify-center mx-auto mb-6"
              animate={{ borderColor: ['rgba(204,0,0,0.3)', 'rgba(204,0,0,0.7)', 'rgba(204,0,0,0.3)'] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <Zap className="h-6 w-6 text-red" />
            </motion.div>

            <h3 className="text-4xl text-off-white mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{h.newsletter.title}</h3>
            <p className="text-light text-sm mb-8">{h.newsletter.subtitle}</p>

            <AnimatePresence mode="wait">
              {subscribed ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-3 py-4 border border-red/30 bg-red/10"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                    className="w-5 h-5 bg-red rounded-full flex items-center justify-center"
                  >
                    <span className="text-white text-xs">✓</span>
                  </motion.div>
                  <span className="text-off-white font-semibold">You're subscribed!</span>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col sm:flex-row gap-3"
                  onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true) }}
                >
                  <input
                    type="email"
                    placeholder={h.newsletter.placeholder}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input flex-1 focus:border-red transition-colors"
                    required
                  />
                  <motion.button
                    type="submit"
                    className="btn-primary shrink-0"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {h.newsletter.subscribe}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="text-xs text-mid mt-4">{h.newsletter.disclaimer}</p>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
