'use client'

import Link from 'next/link'
import { useId, useMemo, useState } from 'react'
import { SanityImage, hasImage } from '@/components/sanity/SanityImage'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ArrowRight, Clock, ExternalLink, Globe, Mail, MapPin, Phone, Search } from '@/components/ui/Icon'
import { PageHero } from '@/components/ui/PageHero'
import { useLanguage, useMessages } from '@/lib/i18n/LanguageContext'
import { DEALER_SERVICES, dealersMessages, type DealerService } from './messages'
import type { Dealer, Image } from '@/lib/sanity/types'
import { languageName } from '@/lib/i18n/languageName'

type Messages = (typeof dealersMessages)['en']

function isService(value: string): value is DealerService {
  return (DEALER_SERVICES as readonly string[]).includes(value)
}

function normalize(value: string) {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

function DealerCard({ dealer, m }: { dealer: Dealer; m: Messages }) {
  const { locale } = useLanguage()
  const services = (dealer.services ?? []).filter(isService)
  const hasCoordinates = Number.isFinite(dealer.latitude) && Number.isFinite(dealer.longitude)
  const website = dealer.website && /^https?:\/\//.test(dealer.website) ? dealer.website : null
  const locality = [dealer.city, dealer.region].filter(Boolean).join(', ')

  return (
    <li className="card flex flex-col p-6 hover:border-dark-3">
      <div className="flex items-start gap-4">
        {hasImage(dealer.logo) ? (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-off-white">
            <SanityImage image={dealer.logo} alt="" fill sizes="48px" className="object-contain p-1" />
          </div>
        ) : null}
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-off-white leading-snug break-words">{dealer.name}</h2>
          <Badge variant={dealer.type === 'service' ? 'gold' : 'red'} className="mt-2">
            {m.types[dealer.type] ?? m.types.dealer}
          </Badge>
        </div>
      </div>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex gap-3">
          <dt>
            <MapPin className="mt-0.5 h-4 w-4 text-red" />
            <span className="sr-only">{m.card.address}</span>
          </dt>
          <dd className="text-light leading-relaxed">
            <span className="whitespace-pre-line">{dealer.address}</span>
            {locality ? <span className="block">{locality}</span> : null}
            <span className="block">{dealer.country}</span>
          </dd>
        </div>
        {dealer.phone ? (
          <div className="flex gap-3">
            <dt>
              <Phone className="mt-0.5 h-4 w-4 text-red" />
              <span className="sr-only">{m.card.phone}</span>
            </dt>
            <dd>
              <a href={`tel:${dealer.phone.replace(/[^\d+]/g, '')}`} className="text-off-white hover:text-red transition-colors">
                {dealer.phone}
              </a>
            </dd>
          </div>
        ) : null}
        {dealer.email ? (
          <div className="flex gap-3">
            <dt>
              <Mail className="mt-0.5 h-4 w-4 text-red" />
              <span className="sr-only">{m.card.email}</span>
            </dt>
            <dd className="min-w-0">
              <a href={`mailto:${dealer.email}`} className="break-all text-off-white hover:text-red transition-colors">
                {dealer.email}
              </a>
            </dd>
          </div>
        ) : null}
        {website ? (
          <div className="flex gap-3">
            <dt>
              <Globe className="mt-0.5 h-4 w-4 text-red" />
              <span className="sr-only">{m.card.website}</span>
            </dt>
            <dd className="min-w-0">
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-off-white hover:text-red transition-colors"
              >
                {website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                <span className="sr-only"> {m.card.newTab}</span>
              </a>
            </dd>
          </div>
        ) : null}
        {dealer.hours ? (
          <div className="flex gap-3">
            <dt>
              <Clock className="mt-0.5 h-4 w-4 text-red" />
              <span className="sr-only">{m.card.hours}</span>
            </dt>
            <dd className="whitespace-pre-line text-light">{dealer.hours}</dd>
          </div>
        ) : null}
      </dl>

      {services.length > 0 ? (
        <div className="mt-5">
          <p className="sr-only">{m.card.services}</p>
          <ul className="flex flex-wrap gap-1.5">
            {services.map((service) => (
              <li key={service} className="bg-dark-3 px-2.5 py-1 text-[11px] uppercase tracking-wider text-light">
                {m.services[service]}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {dealer.languages?.length ? (
        <p className="mt-4 text-xs text-mid">
          {m.card.languages}: {dealer.languages.map((code) => languageName(code, locale)).join(', ')}
        </p>
      ) : null}

      {hasCoordinates ? (
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${dealer.latitude},${dealer.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary mt-6 h-10 justify-center self-start px-4 py-0 text-xs"
        >
          <ExternalLink className="h-4 w-4" />
          {m.card.directions}
          <span className="sr-only"> {m.card.newTab}</span>
        </a>
      ) : null}
    </li>
  )
}

export function DealersView({ dealers, heroImage }: { dealers: Dealer[]; heroImage: Image | null }) {
  const m = useMessages(dealersMessages)
  const ids = useId()
  const [country, setCountry] = useState('all')
  const [service, setService] = useState('all')
  const [query, setQuery] = useState('')

  const countries = useMemo(
    () => Array.from(new Set(dealers.map((dealer) => dealer.country).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [dealers],
  )
  const services = useMemo(() => {
    const present = new Set(dealers.flatMap((dealer) => dealer.services ?? []))
    return DEALER_SERVICES.filter((value) => present.has(value))
  }, [dealers])

  const filtered = useMemo(() => {
    const term = normalize(query)
    return dealers.filter((dealer) => {
      if (country !== 'all' && dealer.country !== country) return false
      if (service !== 'all' && !dealer.services?.includes(service)) return false
      if (!term) return true
      return [dealer.city, dealer.region, dealer.name].some((value) => value && normalize(value).includes(term))
    })
  }, [dealers, country, service, query])

  const isFiltered = country !== 'all' || service !== 'all' || query.trim() !== ''

  function reset() {
    setCountry('all')
    setService('all')
    setQuery('')
  }

  return (
    <div className="min-h-screen bg-black">
      <PageHero eyebrow={m.hero.eyebrow} title={m.hero.title} subtitle={m.hero.subtitle} image={heroImage} />

      {dealers.length > 1 ? (
        <div className="border-b border-dark-3 bg-dark">
          <form
            role="search"
            aria-label={m.filters.title}
            onSubmit={(event) => event.preventDefault()}
            className="container grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.4fr_auto] lg:items-end"
          >
            {countries.length > 1 ? (
              <div>
                <label htmlFor={`${ids}-country`} className="label">
                  {m.filters.country}
                </label>
                <select
                  id={`${ids}-country`}
                  className="select"
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                >
                  <option value="all">{m.filters.all}</option>
                  {countries.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            {services.length > 1 ? (
              <div>
                <label htmlFor={`${ids}-service`} className="label">
                  {m.filters.service}
                </label>
                <select
                  id={`${ids}-service`}
                  className="select"
                  value={service}
                  onChange={(event) => setService(event.target.value)}
                >
                  <option value="all">{m.filters.all}</option>
                  {services.map((value) => (
                    <option key={value} value={value}>
                      {m.services[value]}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="sm:col-span-2 lg:col-span-1">
              <label htmlFor={`${ids}-search`} className="label">
                {m.filters.search}
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mid" />
                <input
                  id={`${ids}-search`}
                  type="search"
                  className="input pl-10"
                  placeholder={m.filters.searchPlaceholder}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>
            {isFiltered ? (
              <button type="button" onClick={reset} className="btn-ghost h-[50px] justify-center">
                {m.filters.reset}
              </button>
            ) : null}
          </form>
        </div>
      ) : null}

      <div className="container section-sm">
        {dealers.length === 0 ? (
          <EmptyState title={m.empty.title} description={m.empty.text} icon={MapPin} action={{ label: m.empty.action, href: '/contact' }} />
        ) : (
          <>
            <p role="status" aria-live="polite" className="mb-6 text-xs uppercase tracking-[0.2em] text-light">
              {m.filters.results(filtered.length)}
            </p>
            {filtered.length > 0 ? (
              <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((dealer) => (
                  <DealerCard key={dealer._id} dealer={dealer} m={m} />
                ))}
              </ul>
            ) : (
              <div className="border border-dark-3 bg-dark px-6 py-16 text-center">
                <h2 className="font-display text-3xl text-off-white leading-none mb-3">{m.noMatch.title}</h2>
                <p className="mx-auto mb-8 max-w-md text-light">{m.noMatch.text}</p>
                <button type="button" onClick={reset} className="btn-secondary">
                  {m.filters.reset}
                </button>
              </div>
            )}
          </>
        )}

        <section aria-labelledby="dealers-trade" className="mt-16 border-l-4 border-red bg-dark p-8 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red mb-3">{m.trade.eyebrow}</p>
          <h2 id="dealers-trade" className="font-display text-4xl md:text-5xl text-off-white leading-none mb-3">
            {m.trade.title}
          </h2>
          <p className="text-light text-sm md:text-base max-w-2xl mb-6 leading-relaxed">{m.trade.text}</p>
          <Link href="/trade" className="btn-primary">
            {m.trade.action} <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  )
}
