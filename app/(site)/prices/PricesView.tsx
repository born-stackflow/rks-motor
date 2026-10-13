'use client'

import Link from 'next/link'
import { SanityImage, hasImage } from '@/components/sanity/SanityImage'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { PageHero } from '@/components/ui/PageHero'
import { ArrowRight, Gauge, Info, MapPin } from '@/components/ui/Icon'
import { useLanguage, useMessages } from '@/contexts/LanguageContext'
import { pricesMessages } from '@/lib/i18n/messages/prices'
import { BRAND_ORDER, BRANDS, MODEL_AVAILABILITY } from '@/lib/site'
import type { Image, ModelCard } from '@/lib/sanity/types'
import { formatPrice } from '@/lib/utils'

type Props = { models: ModelCard[]; heroImage: Image | null }

function Thumb({ model, className }: { model: ModelCard; className: string }) {
  return (
    <div className={`product-shot relative shrink-0 overflow-hidden ${className}`}>
      {hasImage(model.image) ? (
        <SanityImage image={model.image} alt="" fill sizes="112px" className="product-shot-img object-contain p-1.5" />
      ) : (
        <ImagePlaceholder icon={Gauge} />
      )}
    </div>
  )
}

export function PricesView({ models, heroImage }: Props) {
  const p = useMessages(pricesMessages)
  const { t, locale } = useLanguage()

  const groups = BRAND_ORDER.map((brand) => ({ brand, items: models.filter((model) => model.brand === brand) })).filter(
    (group) => group.items.length,
  )

  const price = (model: ModelCard) =>
    model.price != null ? (
      <span className="text-lg font-bold text-gold">{formatPrice(model.price)}</span>
    ) : (
      <span className="text-sm text-light">{t.common.priceOnRequest}</span>
    )

  const availability = (model: ModelCard) => {
    const value = model.availability ? MODEL_AVAILABILITY[model.availability] : null
    return value ? <Badge variant={value.tone}>{value.label[locale]}</Badge> : null
  }

  return (
    <div className="min-h-screen bg-black">
      <PageHero eyebrow={p.hero.eyebrow} title={p.hero.title} subtitle={p.hero.subtitle} image={heroImage} />

      <div className="container py-12">
        {groups.length === 0 ? (
          <EmptyState title={p.empty.title} description={p.empty.description} action={{ label: p.empty.action, href: '/contact' }} />
        ) : (
          <>
            <p className="mb-10 flex items-start gap-3 border border-dark-3 bg-dark p-4 text-sm leading-relaxed text-light">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-red" />
              {p.note}
            </p>

            <div className="space-y-14">
              {groups.map(({ brand, items }) => (
                <section key={brand} aria-labelledby={`prices-${brand}`}>
                  <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-dark-3 pb-3">
                    <h2 id={`prices-${brand}`} className="font-display text-4xl leading-none text-off-white">
                      {BRANDS[brand]}
                    </h2>
                    <p className="text-sm text-mid">{p.count(items.length)}</p>
                  </div>

                  <table className="hidden w-full border-collapse border border-dark-3 text-left md:table">
                    <caption className="sr-only">{p.table.caption(BRANDS[brand])}</caption>
                    <thead className="bg-dark-2">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-light">
                          {p.table.model}
                        </th>
                        <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-light">
                          {p.table.motor}
                        </th>
                        <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-light">
                          {p.table.range}
                        </th>
                        <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-light">
                          {p.table.availability}
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-light">
                          {p.table.price}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((model) => (
                        <tr key={model._id} className="group border-t border-dark-3 odd:bg-dark even:bg-black">
                          <th scope="row" className="px-4 py-3 font-normal">
                            <Link href={`/models/${model.slug}`} className="flex items-center gap-4">
                              <Thumb model={model} className="h-14 w-20" />
                              <span className="min-w-0">
                                <span className="flex items-center gap-2">
                                  <span className="font-bold text-off-white transition-colors group-hover:text-red">
                                    {model.name}
                                  </span>
                                  {model.isNew ? <Badge variant="gold">{t.common.new}</Badge> : null}
                                </span>
                                {model.tagline ? (
                                  <span className="mt-0.5 line-clamp-1 text-xs text-mid">{model.tagline}</span>
                                ) : null}
                              </span>
                            </Link>
                          </th>
                          <td className="px-4 py-3 text-sm text-light">{model.motor ?? '—'}</td>
                          <td className="px-4 py-3 text-sm text-light">{model.range ?? '—'}</td>
                          <td className="px-4 py-3">{availability(model) ?? <span className="text-mid">—</span>}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-right">{price(model)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <ul className="space-y-3 md:hidden">
                    {items.map((model) => (
                      <li key={model._id}>
                        <Link
                          href={`/models/${model.slug}`}
                          className="card group flex items-stretch gap-0 overflow-hidden transition-colors hover:border-red"
                        >
                          <Thumb model={model} className="w-28" />
                          <span className="min-w-0 flex-1 p-4">
                            <span className="mb-1 flex items-start justify-between gap-2">
                              <span className="font-bold leading-tight text-off-white transition-colors group-hover:text-red">
                                {model.name}
                              </span>
                              {model.isNew ? <Badge variant="gold">{t.common.new}</Badge> : null}
                            </span>
                            {model.motor || model.range ? (
                              <span className="mb-2 block text-xs text-mid">
                                {[model.motor, model.range].filter(Boolean).join(' · ')}
                              </span>
                            ) : null}
                            {availability(model)}
                            <span className="mt-2 block">{price(model)}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <div className="mt-12 flex flex-col gap-4 border border-dark-3 bg-dark p-6 sm:flex-row sm:flex-wrap">
              <Link href="/contact?type=purchase" className="btn-primary justify-center">
                {p.quote} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/dealers" className="btn-secondary justify-center">
                <MapPin className="h-4 w-4" /> {p.dealers}
              </Link>
            </div>
          </>
        )}

        <section className="mt-8 border-l-4 border-red bg-dark-2 p-6 md:p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-red">{p.trade.tag}</p>
          <h2 className="mb-2 font-display text-3xl leading-none text-off-white">{p.trade.title}</h2>
          <p className="mb-6 max-w-xl text-sm leading-relaxed text-light">{p.trade.text}</p>
          <Link href="/trade/apply" className="btn-primary inline-flex items-center gap-2">
            {p.trade.action} <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  )
}
