'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Menu, X, ChevronDown } from '@/components/ui/Icon'
import { useLanguage } from '@/contexts/LanguageContext'
import { sanityClient, urlFor } from '@/lib/sanity'
import type { Locale } from '@/lib/i18n/translations'

const socialLinks = [
  { name: 'Instagram', href: '#', icon: '📸' },
  { name: 'YouTube',   href: '#', icon: '▶️' },
  { name: 'Facebook',  href: '#', icon: '👍' },
]

const BRANDS = [
  { value: 'aperyder', label: 'Ape Ryder' },
  { value: 'rks',      label: 'RKS'       },
  { value: 'skyjet',   label: 'Skyjet'    },
]

type NavModel = {
  _id: string
  name: string
  slug: string
  category: string
  thumbnailImage?: { asset?: { _ref?: string }; alt?: string }
}

export default function Header() {
  const { t, locale, setLocale } = useLanguage()
  const [mobileOpen,      setMobileOpen]      = useState(false)
  const [activeDropdown,  setActiveDropdown]  = useState<string | null>(null)
  const [scrolled,        setScrolled]        = useState(false)
  const [activeBrand,     setActiveBrand]     = useState('aperyder')
  const [brandModels,     setBrandModels]     = useState<Record<string, NavModel[]>>({})
  const [mobileModelsOpen, setMobileModelsOpen] = useState(false)
  const pathname   = usePathname()
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fetch models for mega-menu
  useEffect(() => {
    sanityClient.fetch<NavModel[]>(`*[_type == "bikeModel"] | order(order asc, name asc) {
      _id, name, "slug": slug.current, category,
      "thumbnailImage": coalesce(colours[0].image, heroImage) { asset, alt }
    }`).then((models) => {
      const grouped: Record<string, NavModel[]> = {}
      for (const m of models ?? []) {
        if (!grouped[m.category]) grouped[m.category] = []
        grouped[m.category].push(m)
      }
      setBrandModels(grouped)
      // Default to first brand that has models
      const first = BRANDS.find(b => (grouped[b.value]?.length ?? 0) > 0)
      if (first) setActiveBrand(first.value)
    })
  }, [])

  // Delayed close so user can move from nav item → mega-menu without it closing
  const openDropdown = (name: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setActiveDropdown(name)
  }
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 180)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setMobileOpen(false)
  }

  const isActive = (href: string) => href !== '/' && pathname.startsWith(href)
  const toggleLocale = () => setLocale(locale === 'en' ? 'it' : 'en' as Locale)

  const otherNavItems = [
    { name: t.nav.parts,   href: '/parts'   },
    { name: t.nav.about,   href: '/about'   },
    { name: t.nav.dealers, href: '/dealers' },
    { name: t.nav.news,    href: '/news'    },
    { name: t.nav.prices,  href: '/prices'  },
    { name: t.nav.media,   href: '/media'   },
    { name: t.nav.contact, href: '/contact' },
  ]

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-[72px] flex items-center',
          scrolled
            ? 'bg-black/95 backdrop-blur-md border-b border-red/30'
            : 'bg-black/80 backdrop-blur-sm border-b border-dark-3/50'
        )}
      >
        <div className="container flex items-center justify-between w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 bg-red flex items-center justify-center">
              <span
                className="text-white font-bold text-lg tracking-tight"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                RKS
              </span>
            </div>
            <div className="hidden sm:block">
              <div
                className="text-off-white font-bold text-lg leading-none tracking-wide"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                RKS E-BIKES
              </div>
              <div className="text-[9px] text-mid uppercase tracking-[0.25em] mt-0.5">
                {t.brand.tagline}
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0">

            {/* ── Models mega-menu trigger ─────────────────────── */}
            <div
              className="relative"
              onMouseEnter={() => openDropdown('models')}
              onMouseLeave={scheduleClose}
            >
              <Link
                href="/models"
                className={cn(
                  'relative flex items-center gap-1 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider transition-colors duration-200',
                  isActive('/models') ? 'text-red' : 'text-light hover:text-off-white'
                )}
              >
                {t.nav.models}
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Link>

              <AnimatePresence>
                {activeDropdown === 'models' && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="fixed top-[72px] left-0 right-0 bg-dark-2 border-b border-dark-3 shadow-2xl z-50"
                    onMouseEnter={() => openDropdown('models')}
                    onMouseLeave={scheduleClose}
                  >
                    <div className="container py-7">
                      <div className="grid grid-cols-[200px_1fr] gap-10">

                        {/* Left — brand list */}
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-mid mb-5">
                            Companies
                          </p>
                          <div className="space-y-1">
                            {BRANDS.map(brand => (
                              <button
                                key={brand.value}
                                onMouseEnter={() => setActiveBrand(brand.value)}
                                onClick={() => {
                                  setActiveDropdown(null)
                                  window.location.href = `/models?brand=${brand.value}`
                                }}
                                className={cn(
                                  'w-full text-left px-4 py-3 text-[13px] font-bold uppercase tracking-widest transition-all border-l-2',
                                  activeBrand === brand.value
                                    ? 'border-red text-red bg-dark-3'
                                    : 'border-transparent text-light hover:text-off-white hover:border-red/40 hover:bg-dark-3'
                                )}
                              >
                                {brand.label}
                              </button>
                            ))}
                            <Link
                              href="/models"
                              onClick={() => setActiveDropdown(null)}
                              className="block px-4 py-2 text-[11px] text-mid hover:text-off-white uppercase tracking-widest mt-3 border-t border-dark-3 pt-4"
                            >
                              All Models →
                            </Link>
                          </div>
                        </div>

                        {/* Right — model thumbnails */}
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-mid mb-5">
                            {BRANDS.find(b => b.value === activeBrand)?.label} E-Bikes
                          </p>
                          {(brandModels[activeBrand]?.length ?? 0) > 0 ? (
                            <div className="grid grid-cols-4 xl:grid-cols-6 gap-3">
                              {brandModels[activeBrand].slice(0, 12).map(model => (
                                <Link
                                  key={model._id}
                                  href={`/models/${model.slug}`}
                                  onClick={() => setActiveDropdown(null)}
                                  className="group text-center"
                                >
                                  <div className="aspect-square bg-dark border border-dark-3 overflow-hidden mb-2 group-hover:border-red/50 transition-colors">
                                    {model.thumbnailImage?.asset ? (
                                      <Image
                                        src={urlFor(model.thumbnailImage).width(160).height(160).fit('crop').url()}
                                        alt={model.name}
                                        width={160}
                                        height={160}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-mid text-[10px]">No image</span>
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-light group-hover:text-red transition-colors font-semibold truncate leading-tight">
                                    {model.name}
                                  </p>
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <p className="text-mid text-sm">No models yet for this brand.</p>
                          )}

                          {/* View all link */}
                          <div className="mt-5 pt-4 border-t border-dark-3">
                            <Link
                              href={`/models?brand=${activeBrand}`}
                              onClick={() => setActiveDropdown(null)}
                              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-red hover:text-red-light transition-colors"
                            >
                              View All {BRANDS.find(b => b.value === activeBrand)?.label} Models →
                            </Link>
                          </div>
                        </div>

                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Other nav items ──────────────────────────────── */}
            {otherNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'relative px-4 py-2 text-[11px] font-semibold uppercase tracking-wider transition-colors duration-200',
                  isActive(item.href) ? 'text-red' : 'text-light hover:text-off-white'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right: language toggle + Trade button + mobile toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleLocale}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 border border-dark-3 hover:border-red text-[11px] font-bold uppercase tracking-widest text-mid hover:text-red transition-all duration-200"
              aria-label="Switch language"
            >
              <span className={locale === 'en' ? 'text-red' : 'text-mid'}>EN</span>
              <span className="text-dark-3 mx-0.5">|</span>
              <span className={locale === 'it' ? 'text-red' : 'text-mid'}>IT</span>
            </button>

            <Link
              href="/trade"
              className="hidden lg:inline-flex items-center px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-red border border-red hover:bg-red hover:text-white transition-all duration-200"
            >
              {t.nav.trade}
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-light hover:text-off-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black flex flex-col lg:hidden overflow-y-auto"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red" />

            <div className="flex-1 flex flex-col justify-center px-10 pt-20">

              {/* Models — expandable with brands */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <button
                  onClick={() => setMobileModelsOpen(o => !o)}
                  className="flex items-center gap-3 py-2 text-off-white hover:text-red transition-colors"
                  style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '0.02em' }}
                >
                  {t.nav.models}
                  <ChevronDown className={`h-5 w-5 transition-transform ${mobileModelsOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {mobileModelsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-4 mb-2"
                    >
                      {BRANDS.map(brand => (
                        <Link
                          key={brand.value}
                          href={`/models?brand=${brand.value}`}
                          className="block py-1.5 text-light hover:text-red transition-colors text-sm font-semibold uppercase tracking-widest"
                        >
                          {brand.label}
                        </Link>
                      ))}
                      <Link
                        href="/models"
                        className="block py-1.5 text-mid hover:text-off-white transition-colors text-xs font-semibold uppercase tracking-widest mt-1 border-t border-dark-3 pt-2"
                      >
                        All Models
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {otherNavItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: (i + 1) * 0.05, ease: 'easeOut' }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'block py-2 transition-colors duration-150',
                      isActive(item.href) ? 'text-red' : 'text-off-white hover:text-red'
                    )}
                    style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '0.02em' }}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 pt-8 border-t border-dark-3 flex items-center gap-4"
              >
                <Link
                  href="/trade"
                  className="inline-flex items-center px-6 py-3 bg-red text-white text-sm font-semibold uppercase tracking-widest"
                >
                  {t.nav.trade}
                </Link>
                <button
                  type="button"
                  onClick={toggleLocale}
                  className="flex items-center gap-1 px-4 py-3 border border-dark-3 text-sm font-bold uppercase tracking-widest"
                >
                  <span className={locale === 'en' ? 'text-red' : 'text-mid'}>EN</span>
                  <span className="text-dark-3 mx-1">|</span>
                  <span className={locale === 'it' ? 'text-red' : 'text-mid'}>IT</span>
                </button>
              </motion.div>
            </div>

            <div className="px-10 pb-10 flex gap-4">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  className="w-10 h-10 bg-dark-3 flex items-center justify-center text-light hover:bg-red hover:text-white transition-colors text-sm"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-[72px]" />
    </>
  )
}
