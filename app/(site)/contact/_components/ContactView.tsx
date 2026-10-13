'use client'

import Link from 'next/link'
import type { ComponentType, ReactNode } from 'react'
import { useMessages } from '@/contexts/LanguageContext'
import { contactMessages } from '@/lib/i18n/messages/contact'
import { PageHero } from '@/components/ui/PageHero'
import { ArrowRight, Building2, ExternalLink, Mail, MapPin, Phone, Users } from '@/components/ui/Icon'
import type { Image } from '@/lib/sanity/types'
import { ContactForm } from './ContactForm'
import type { ContactPrefill } from './enquiry'

export type ContactDetails = {
  address?: string
  phone?: string
  email?: string
  googleMapsUrl?: string
}

type Props = {
  image?: Image | null
  details: ContactDetails
  models: Array<{ name: string; slug: string }>
  prefill: ContactPrefill
}

function DetailRow({
  icon: IconCmp,
  label,
  children,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex items-start gap-4 border border-dark-3 bg-dark p-4">
      <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center border border-red/30 bg-red/10 text-red">
        <IconCmp className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-light mb-1">{label}</p>
        <div className="text-off-white text-sm break-words">{children}</div>
      </div>
    </div>
  )
}

export function ContactView({ image, details, models, prefill }: Props) {
  const m = useMessages(contactMessages)
  const { address, phone, email, googleMapsUrl } = details
  const hasDetails = Boolean(address || phone || email)

  return (
    <>
      <PageHero eyebrow={m.hero.eyebrow} title={m.hero.title} subtitle={m.hero.subtitle} image={image} />

      <div className="container py-14 md:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] xl:gap-20">
          <aside aria-labelledby="contact-info-title" className="order-2 space-y-5 lg:order-1">
            <div>
              <p className="text-red text-xs font-semibold uppercase tracking-[0.25em] mb-2">{m.info.tag}</p>
              <h2 id="contact-info-title" className="font-display text-4xl text-off-white leading-none mb-4">
                {m.info.title}
              </h2>
              <p className="text-light text-sm leading-relaxed">{hasDetails ? m.info.intro : m.info.noDetails}</p>
            </div>

            {address ? (
              <DetailRow icon={MapPin} label={m.info.address}>
                <address className="not-italic whitespace-pre-line">{address}</address>
                {googleMapsUrl ? (
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex min-h-[40px] items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-light hover:text-off-white"
                  >
                    {m.info.maps}
                    <span aria-hidden="true">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </span>
                  </a>
                ) : null}
              </DetailRow>
            ) : null}
            {phone ? (
              <DetailRow icon={Phone} label={m.info.phone}>
                <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="hover:text-red-light">
                  {phone}
                </a>
              </DetailRow>
            ) : null}
            {email ? (
              <DetailRow icon={Mail} label={m.info.email}>
                <a href={`mailto:${email}`} className="hover:text-red-light">
                  {email}
                </a>
              </DetailRow>
            ) : null}

            <div className="border-l-4 border-red bg-dark-2 p-5">
              <p className="flex items-center gap-2 text-off-white font-bold text-sm mb-1">
                <span aria-hidden="true" className="text-red">
                  <Users className="h-4 w-4" />
                </span>
                {m.links.dealersTitle}
              </p>
              <p className="text-light text-sm mb-4 leading-relaxed">{m.links.dealersText}</p>
              <Link href="/dealers" className="btn-ghost -ml-6 min-h-[40px] text-off-white hover:text-red-light">
                {m.links.dealersCta}
                <span aria-hidden="true">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>

            <div className="border-l-4 border-red bg-dark-2 p-5">
              <p className="flex items-center gap-2 text-off-white font-bold text-sm mb-1">
                <span aria-hidden="true" className="text-red">
                  <Building2 className="h-4 w-4" />
                </span>
                {m.links.tradeTitle}
              </p>
              <p className="text-light text-sm mb-4 leading-relaxed">{m.links.tradeText}</p>
              <Link href="/trade" className="btn-ghost -ml-6 min-h-[40px] text-off-white hover:text-red-light">
                {m.links.tradeCta}
                <span aria-hidden="true">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          </aside>

          <section aria-labelledby="contact-form-title" className="order-1 min-w-0 lg:order-2">
            <p className="text-red text-xs font-semibold uppercase tracking-[0.25em] mb-2">{m.form.tag}</p>
            <h2 id="contact-form-title" className="font-display text-4xl text-off-white leading-none mb-8">
              {m.form.title}
            </h2>
            <ContactForm models={models} prefill={prefill} />
          </section>
        </div>
      </div>
    </>
  )
}
