'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ChevronDown, Menu, Search, ShoppingCart, X } from '@/components/ui/Icon'
import { SocialIcon, SOCIAL_LABELS, socialEntries } from '@/components/ui/SocialIcon'
import { SanityImage } from '@/components/sanity/SanityImage'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCart } from '@/lib/cart'
import { BRAND_ORDER, BRANDS } from '@/lib/site'
import type { Brand, ModelNavItem, SocialLinks } from '@/lib/sanity/types'

type Props = { models: ModelNavItem[]; socialLinks?: SocialLinks }

export function Logo() {
  const { t } = useLanguage()
  return (
    <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="RKS E-Bikes">
      <span className="w-10 h-10 bg-red flex items-center justify-center font-display text-white text-lg tracking-tight">
        RKS
      </span>
      <span className="hidden sm:block xl:hidden 2xl:block">
        <span className="block font-display text-off-white text-lg leading-none tracking-wide">RKS E-BIKES</span>
        <span className="block text-[9px] text-mid uppercase tracking-[0.25em] mt-0.5">{t.brand.tagline}</span>
      </span>
    </Link>
  )
}

function LocaleToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage()
  return (
    <button
      type="button"
      onClick={() => setLocale(locale === 'en' ? 'it' : 'en')}
      className={cn(
        'items-center gap-1 border border-dark-3 hover:border-red font-bold uppercase tracking-widest text-mid transition-colors',
        className,
      )}
      aria-label={t.nav.switchLanguage}
    >
      <span className={locale === 'en' ? 'text-red' : 'text-mid'}>EN</span>
      <span className="text-dark-3 mx-0.5">|</span>
      <span className={locale === 'it' ? 'text-red' : 'text-mid'}>IT</span>
    </button>
  )
}

export default function Header({ models, socialLinks }: Props) {
  const { t } = useLanguage()
  const pathname = usePathname()
  const cartItems = useCart()
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0)

  const byBrand = useMemo(() => {
    const grouped: Record<Brand, ModelNavItem[]> = { aperyder: [], rks: [], skyjet: [] }
    for (const model of models) grouped[model.brand]?.push(model)
    return grouped
  }, [models])
  const brands = BRAND_ORDER.filter((brand) => byBrand[brand].length > 0)

  const [megaOpen, setMegaOpen] = useState(false)
  const [activeBrand, setActiveBrand] = useState<Brand>(brands[0] ?? 'aperyder')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileModelsOpen, setMobileModelsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setMobileOpen(false)
    setMegaOpen(false)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setMegaOpen(true)
  }
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 180)
  }

  const isActive = (href: string) => href !== '/' && pathname.startsWith(href)

  const navItems = [
    { name: t.nav.parts, href: '/parts' },
    { name: t.nav.about, href: '/about' },
    { name: t.nav.dealers, href: '/dealers' },
    { name: t.nav.news, href: '/news' },
    { name: t.nav.prices, href: '/prices' },
    { name: t.nav.media, href: '/media' },
    { name: t.nav.contact, href: '/contact' },
  ]
  const socials = socialEntries(socialLinks)

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-red focus:px-4 focus:py-2 focus:text-white">
        {t.nav.skipToContent}
      </a>
      <header
        className={cn(
          'sticky top-0 z-50 h-[72px] flex items-center transition-colors duration-300',
          scrolled ? 'bg-black/95 backdrop-blur-md border-b border-red/30' : 'bg-black/80 backdrop-blur-sm border-b border-dark-3/50',
        )}
      >
        <div className="container flex items-center justify-between w-full">
          <Logo />

          <nav className="hidden xl:flex items-center" aria-label="Main">
            <div className="relative" onMouseEnter={openMega} onMouseLeave={scheduleClose}>
              <Link
                href="/models"
                aria-expanded={megaOpen}
                onFocus={openMega}
                className={cn(
                  'flex items-center gap-1 px-2.5 2xl:px-4 py-2 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap transition-colors',
                  isActive('/models') ? 'text-red' : 'text-light hover:text-off-white',
                )}
              >
                {t.nav.models}
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Link>
            </div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-2.5 2xl:px-4 py-2 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap transition-colors',
                  isActive(item.href) ? 'text-red' : 'text-light hover:text-off-white',
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/search"
              aria-label={t.nav.search}
              className="w-10 h-10 flex items-center justify-center text-light hover:text-red transition-colors"
            >
              <Search className="h-4 w-4" />
            </Link>
            <Link
              href="/cart"
              aria-label={t.nav.cart}
              className="relative w-10 h-10 flex items-center justify-center text-light hover:text-red transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 ? (
                <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-red text-white text-[10px] font-bold leading-4 text-center">
                  {cartCount}
                </span>
              ) : null}
            </Link>
            <LocaleToggle className="hidden sm:flex px-3 py-1.5 text-[11px]" />
            <Link
              href="/trade"
              className="hidden xl:inline-flex items-center whitespace-nowrap px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-red border border-red hover:bg-red hover:text-white transition-colors"
            >
              {t.nav.trade}
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="xl:hidden w-10 h-10 flex items-center justify-center text-light hover:text-off-white"
              aria-label={t.nav.menu}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {megaOpen && brands.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="hidden xl:block absolute top-full left-0 right-0 bg-dark-2 border-b border-dark-3 shadow-2xl"
              onMouseEnter={openMega}
              onMouseLeave={scheduleClose}
            >
              <div className="container py-7 grid grid-cols-[200px_1fr] gap-10">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-mid mb-5">{t.nav.brands}</p>
                  <div className="space-y-1">
                    {brands.map((brand) => (
                      <Link
                        key={brand}
                        href={`/models?brand=${brand}`}
                        onMouseEnter={() => setActiveBrand(brand)}
                        onFocus={() => setActiveBrand(brand)}
                        className={cn(
                          'block px-4 py-3 text-[13px] font-bold uppercase tracking-widest transition-colors border-l-2',
                          activeBrand === brand
                            ? 'border-red text-red bg-dark-3'
                            : 'border-transparent text-light hover:text-off-white hover:border-red/40 hover:bg-dark-3',
                        )}
                      >
                        {BRANDS[brand]}
                      </Link>
                    ))}
                    <Link
                      href="/models"
                      className="block px-4 py-2 text-[11px] text-mid hover:text-off-white uppercase tracking-widest mt-3 border-t border-dark-3 pt-4"
                    >
                      {t.nav.allModels} →
                    </Link>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-mid mb-5">
                    {t.nav.brandModels(BRANDS[activeBrand])}
                  </p>
                  {byBrand[activeBrand].length > 0 ? (
                    <div className="grid grid-cols-4 xl:grid-cols-6 gap-3">
                      {byBrand[activeBrand].slice(0, 12).map((model) => (
                        <Link key={model._id} href={`/models/${model.slug}`} className="group text-center">
                          <div className="relative aspect-square bg-dark border border-dark-3 overflow-hidden mb-2 group-hover:border-red/50 transition-colors">
                            <SanityImage
                              image={model.image}
                              alt={model.name}
                              fill
                              sizes="160px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <p className="text-[11px] text-light group-hover:text-red transition-colors font-semibold truncate leading-tight">
                            {model.name}
                          </p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-mid text-sm">{t.nav.noModels}</p>
                  )}
                  <div className="mt-5 pt-4 border-t border-dark-3">
                    <Link
                      href={`/models?brand=${activeBrand}`}
                      className="text-[11px] font-semibold uppercase tracking-widest text-red hover:text-red-light transition-colors"
                    >
                      {t.nav.viewAllBrand(BRANDS[activeBrand])} →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-[72px] z-40 bg-black flex flex-col xl:hidden overflow-y-auto"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red" />
            <nav className="flex-1 flex flex-col px-8 py-8" aria-label="Mobile">
              <button
                type="button"
                onClick={() => setMobileModelsOpen((open) => !open)}
                aria-expanded={mobileModelsOpen}
                className="flex items-center gap-3 py-2 font-display text-off-white hover:text-red text-[clamp(2rem,8vw,3rem)] tracking-[0.02em]"
              >
                {t.nav.models}
                <ChevronDown className={cn('h-5 w-5 transition-transform', mobileModelsOpen && 'rotate-180')} />
              </button>
              {mobileModelsOpen ? (
                <div className="pl-4 mb-2">
                  {brands.map((brand) => (
                    <Link
                      key={brand}
                      href={`/models?brand=${brand}`}
                      className="block py-1.5 text-light hover:text-red text-sm font-semibold uppercase tracking-widest"
                    >
                      {BRANDS[brand]}
                    </Link>
                  ))}
                  <Link
                    href="/models"
                    className="block py-1.5 text-mid hover:text-off-white text-xs font-semibold uppercase tracking-widest mt-1 border-t border-dark-3 pt-2"
                  >
                    {t.nav.allModels}
                  </Link>
                </div>
              ) : null}
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'block py-2 font-display text-[clamp(2rem,8vw,3rem)] tracking-[0.02em] transition-colors',
                    isActive(item.href) ? 'text-red' : 'text-off-white hover:text-red',
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-8 pt-8 border-t border-dark-3 flex flex-wrap items-center gap-4">
                <Link href="/trade" className="btn-primary">
                  {t.nav.trade}
                </Link>
                <LocaleToggle className="flex px-4 py-3 text-sm" />
              </div>
              {socials.length > 0 ? (
                <div className="mt-8 flex gap-3">
                  {socials.map(({ network, href }) => (
                    <a
                      key={network}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={SOCIAL_LABELS[network]}
                      className="w-10 h-10 bg-dark-3 flex items-center justify-center text-light hover:bg-red hover:text-white transition-colors"
                    >
                      <SocialIcon network={network} />
                    </a>
                  ))}
                </div>
              ) : null}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
