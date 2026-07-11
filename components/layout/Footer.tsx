'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

const socials = [
  { name: 'IG', href: '#' },
  { name: 'YT', href: '#' },
  { name: 'FB', href: '#' },
  { name: 'TW', href: '#' },
]

export default function Footer() {
  const { t } = useLanguage()
  const { links, sections } = t.footer

  const footerLinks = {
    [sections.Models]: [
      { name: links.allModels, href: '/models' },
      { name: links.sport,     href: '/models?category=sport' },
      { name: links.adventure, href: '/models?category=adventure' },
      { name: links.cruiser,   href: '/models?category=cruiser' },
      { name: links.electric,  href: '/models?category=electric' },
      { name: links.compare,   href: '/compare' },
    ],
    [sections.Company]: [
      { name: links.aboutUs,  href: '/about' },
      { name: links.news,     href: '/news' },
      { name: links.media,    href: '/media' },
      { name: links.careers,  href: '/about#careers' },
    ],
    [sections.Support]: [
      { name: links.parts,    href: '/parts' },
      { name: links.dealers,  href: '/dealers' },
      { name: links.prices,   href: '/prices' },
      { name: links.contact,  href: '/contact' },
    ],
    [sections.Trade]: [
      { name: links.tradePartners, href: '/trade' },
      { name: links.applyNow,      href: '/trade/apply' },
      { name: links.dealerPortal,  href: '/trade#portal' },
      { name: links.wholesale,     href: '/trade#wholesale' },
    ],
  }

  return (
    <footer className="bg-black border-t border-dark-3">
      <div className="divider-red" />

      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red flex items-center justify-center">
                <span className="text-white font-bold text-lg" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  RKS
                </span>
              </div>
              <span className="text-off-white text-xl font-bold" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                RKS E-BIKES
              </span>
            </div>
            <p className="text-light text-sm leading-relaxed max-w-xs">
              {t.footer.description}
            </p>
            <div className="flex gap-2 mt-6">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  className="w-9 h-9 bg-dark-3 border border-dark-3 flex items-center justify-center text-xs text-light hover:bg-red hover:text-white hover:border-red transition-all duration-200"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-off-white text-lg mb-4 tracking-wide" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                {title}
              </h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-light text-sm hover:text-red hover:pl-1 transition-all duration-150">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-dark-2 border-t border-dark-3">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-mid text-xs">© {new Date().getFullYear()} {t.footer.copyright}</p>
          <div className="flex gap-5 flex-wrap justify-center">
            <Link href="/privacy" className="text-mid text-xs hover:text-light transition-colors">{t.footer.privacy}</Link>
            <Link href="/terms"   className="text-mid text-xs hover:text-light transition-colors">{t.footer.terms}</Link>
            <span className="text-dark-3 text-xs hidden sm:inline">|</span>
            <span className="text-mid text-xs">{t.footer.builtBy} <span className="text-red">Tech Logies</span></span>
          </div>
        </div>
      </div>
    </footer>
  )
}
