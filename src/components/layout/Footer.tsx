'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { Mail, MapPin, Phone } from '@/components/ui/Icon'
import { SocialIcon, SOCIAL_LABELS, socialEntries } from '@/components/ui/SocialIcon'
import { BRAND_ORDER, BRANDS } from '@/lib/site'
import type { SiteSettings } from '@/lib/sanity/types'

type Props = { settings: Pick<SiteSettings, 'socialLinks' | 'footerText' | 'phone' | 'email' | 'address'> | null }

export default function Footer({ settings }: Props) {
  const { t } = useLanguage()
  const { links, sections } = t.footer

  const columns = [
    {
      title: sections.models,
      items: [
        { name: t.nav.allModels, href: '/models' },
        ...BRAND_ORDER.map((brand) => ({ name: BRANDS[brand], href: `/models?brand=${brand}` })),
        { name: links.compare, href: '/compare' },
      ],
    },
    {
      title: sections.company,
      items: [
        { name: links.about, href: '/about' },
        { name: links.news, href: '/news' },
        { name: links.media, href: '/media' },
      ],
    },
    {
      title: sections.support,
      items: [
        { name: links.parts, href: '/parts' },
        { name: links.dealers, href: '/dealers' },
        { name: links.prices, href: '/prices' },
        { name: links.contact, href: '/contact' },
      ],
    },
    {
      title: sections.trade,
      items: [
        { name: links.trade, href: '/trade' },
        { name: links.apply, href: '/trade/apply' },
      ],
    },
  ]

  const socials = socialEntries(settings?.socialLinks)
  const contact = [
    settings?.phone ? { icon: Phone, label: settings.phone, href: `tel:${settings.phone.replace(/\s+/g, '')}` } : null,
    settings?.email ? { icon: Mail, label: settings.email, href: `mailto:${settings.email}` } : null,
    settings?.address ? { icon: MapPin, label: settings.address, href: null } : null,
  ].filter((item) => item !== null)

  return (
    <footer className="bg-black border-t border-dark-3">
      <div className="divider-red" />
      <div className="container py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 bg-red flex items-center justify-center font-display text-white text-lg">RKS</span>
              <span className="font-display text-off-white text-xl">RKS E-BIKES</span>
            </div>
            <p className="text-light text-sm leading-relaxed max-w-xs">{settings?.footerText || t.brand.description}</p>
            {contact.length > 0 ? (
              <ul className="mt-6 space-y-2">
                {contact.map(({ icon: IconCmp, label, href }) => (
                  <li key={label} className="flex items-start gap-2 text-sm text-light">
                    <IconCmp className="h-4 w-4 mt-0.5 shrink-0 text-red" />
                    {href ? (
                      <a href={href} className="hover:text-off-white transition-colors">
                        {label}
                      </a>
                    ) : (
                      <span className="whitespace-pre-line">{label}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
            {socials.length > 0 ? (
              <div className="flex gap-2 mt-6">
                {socials.map(({ network, href }) => (
                  <a
                    key={network}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={SOCIAL_LABELS[network]}
                    className="w-9 h-9 bg-dark-3 border border-dark-3 flex items-center justify-center text-light hover:bg-red hover:text-white hover:border-red transition-colors"
                  >
                    <SocialIcon network={network} />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="font-display text-off-white text-lg mb-4 tracking-wide">{column.title}</h2>
              <ul className="space-y-2">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-light text-sm hover:text-red transition-colors">
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
        <div className="container py-4">
          <p className="text-mid text-xs text-center sm:text-left">
            © {new Date().getFullYear()} RKS E-Bikes. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
