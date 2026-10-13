'use client'

import { Suspense, useId, type ReactNode } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { SanityImage, hasImage } from '@/components/sanity/SanityImage'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { ArrowRight, Check, Gauge, X } from '@/components/ui/Icon'
import { useLanguage, useLocalized, useMessages } from '@/contexts/LanguageContext'
import { compareMessages } from '@/lib/i18n/messages/compare'
import { BRAND_ORDER, BRANDS, MODEL_AVAILABILITY, SPEC_LABELS, SPEC_ORDER } from '@/lib/site'
import type { CompareModel } from '@/lib/sanity/types'
import { cn, formatPrice } from '@/lib/utils'
import { contactHref, specValue } from '../models/_lib/specs'

const SLOTS = 3
type Slots = Array<string | null>

function pad(slugs: Slots): Slots {
  return Array.from({ length: SLOTS }, (_, i) => slugs[i] ?? null)
}

function resolveSlots(models: CompareModel[], param: string | null): Slots {
  const defaults = () => pad(models.slice(0, 2).map((model) => model.slug))
  if (param === null) return defaults()

  const known = new Set(models.map((model) => model.slug))
  const seen = new Set<string>()
  const slots = param
    .split(',')
    .slice(0, SLOTS)
    .map((raw) => {
      const slug = raw.trim()
      if (!slug || !known.has(slug) || seen.has(slug)) return null
      seen.add(slug)
      return slug
    })
  const requested = param.replace(/,/g, '').trim() !== ''
  return requested && slots.every((slug) => !slug) ? defaults() : pad(slots)
}

function writeSlots(slots: Slots) {
  let end = slots.length
  while (end > 0 && !slots[end - 1]) end--
  const ids = slots.slice(0, end).map((slug) => slug ?? '').join(',')
  window.history.replaceState(null, '', `${window.location.pathname}?ids=${ids}`)
}

export default function CompareClient({ models }: { models: CompareModel[] }) {
  return (
    <Suspense fallback={<CompareView models={models} param={null} />}>
      <CompareFromUrl models={models} />
    </Suspense>
  )
}

function CompareFromUrl({ models }: { models: CompareModel[] }) {
  return <CompareView models={models} param={useSearchParams().get('ids')} />
}

function Missing({ label }: { label: string }) {
  return (
    <>
      <span aria-hidden="true" className="text-mid">
        —
      </span>
      <span className="sr-only">{label}</span>
    </>
  )
}

function CompareView({ models, param }: { models: CompareModel[]; param: string | null }) {
  const m = useMessages(compareMessages)
  const { t, locale } = useLanguage()
  const l = useLocalized()
  const ids = useId()

  const slots = resolveSlots(models, param)
  const compared = slots.flatMap((slug) => models.filter((model) => model.slug === slug))

  const setSlot = (index: number, slug: string) => {
    const next = [...slots]
    next[index] = slug || null
    writeSlots(next)
  }

  const specKeys = SPEC_ORDER.filter((key) => compared.some((model) => specValue(model.specs, key)))
  const showAvailability = compared.some((model) => model.availability)
  const features = Array.from(new Set(compared.flatMap((model) => model.features ?? [])))
  const brandGroups = BRAND_ORDER.map((brand) => ({ brand, items: models.filter((model) => model.brand === brand) })).filter(
    (group) => group.items.length,
  )

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-dark-3 bg-dark-2">
        <div className="container animate-fade-up py-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-red">{m.eyebrow}</p>
          <h1 className="font-display text-5xl leading-none text-off-white md:text-6xl">{m.title}</h1>
          <p className="mt-3 max-w-2xl text-light">{m.subtitle}</p>
        </div>
      </header>

      <div className="container py-10">
        {models.length < 2 ? (
          <EmptyState
            title={m.notEnough.title}
            description={m.notEnough.description}
            action={{ label: m.notEnough.action, href: '/models' }}
          />
        ) : (
          <>
            <fieldset className="mb-10 border border-dark-3 bg-dark p-5">
              <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-light">{m.selectors}</legend>
              <div className="grid gap-4 sm:grid-cols-3">
                {slots.map((slug, index) => (
                  <div key={index}>
                    <label htmlFor={`${ids}-slot-${index}`} className="label">
                      {m.slot(index + 1)}
                    </label>
                    <select
                      id={`${ids}-slot-${index}`}
                      value={slug ?? ''}
                      onChange={(e) => setSlot(index, e.target.value)}
                      className="select"
                    >
                      <option value="">{m.none}</option>
                      {brandGroups.map(({ brand, items }) => (
                        <optgroup key={brand} label={BRANDS[brand]}>
                          {items.map((model) => (
                            <option
                              key={model._id}
                              value={model.slug}
                              disabled={model.slug !== slug && slots.includes(model.slug)}
                            >
                              {model.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </fieldset>

            {compared.length < 2 ? (
              <EmptyState title={m.needTwo.title} description={m.needTwo.description} />
            ) : (
              <>
                <p className="mb-3 text-xs text-mid md:hidden">{m.scrollHint}</p>
                <div
                  role="region"
                  aria-labelledby={`${ids}-caption`}
                  tabIndex={0}
                  className="overflow-x-auto border border-dark-3 focus-visible:outline-2 focus-visible:outline-red"
                >
                  <table
                    className={cn(
                      'w-full table-fixed border-collapse text-left',
                      compared.length === 3 ? 'min-w-[720px]' : 'min-w-[520px]',
                    )}
                  >
                    <caption id={`${ids}-caption`} className="sr-only">
                      {m.table.caption}
                    </caption>
                    <colgroup>
                      <col className="w-36 md:w-52" />
                      {compared.map((model) => (
                        <col key={model._id} />
                      ))}
                    </colgroup>
                    <thead>
                      <tr className="bg-black">
                        <td className="sticky left-0 z-10 bg-inherit p-3">
                          <span className="sr-only">{m.table.spec}</span>
                        </td>
                        {compared.map((model) => (
                          <th key={model._id} scope="col" className="border-l border-dark-3 p-3 align-top font-normal">
                            <div className="product-shot relative mb-3 aspect-[16/9] overflow-hidden">
                              {hasImage(model.image) ? (
                                <SanityImage
                                  image={model.image}
                                  alt=""
                                  fill
                                  sizes="(max-width: 768px) 60vw, 33vw"
                                  className="product-shot-img object-contain p-3"
                                />
                              ) : (
                                <ImagePlaceholder icon={Gauge} />
                              )}
                            </div>
                            <Badge variant="red">{BRANDS[model.brand]}</Badge>
                            <span className="mt-2 block font-display text-2xl leading-none text-off-white">{model.name}</span>
                            <Link
                              href={`/models/${model.slug}`}
                              className="mt-2 inline-flex min-h-10 items-center gap-1 text-xs font-semibold uppercase tracking-wider text-red transition-colors hover:text-red-light"
                            >
                              {m.details} <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <Row label={m.table.price}>
                        {compared.map((model) => (
                          <td key={model._id} className="border-l border-dark-3 px-4 py-3">
                            {model.price != null ? (
                              <span className="text-lg font-bold text-gold">{formatPrice(model.price)}</span>
                            ) : (
                              <span className="text-sm text-light">{t.common.priceOnRequest}</span>
                            )}
                          </td>
                        ))}
                      </Row>
                      {showAvailability ? (
                        <Row label={m.table.availability}>
                          {compared.map((model) => {
                            const availability = model.availability ? MODEL_AVAILABILITY[model.availability] : null
                            return (
                              <td key={model._id} className="border-l border-dark-3 px-4 py-3">
                                {availability ? (
                                  <Badge variant={availability.tone}>{availability.label[locale]}</Badge>
                                ) : (
                                  <Missing label={m.table.notAvailable} />
                                )}
                              </td>
                            )
                          })}
                        </Row>
                      ) : null}
                      {specKeys.map((key) => (
                        <Row key={key} label={l(SPEC_LABELS[key])}>
                          {compared.map((model) => {
                            const value = specValue(model.specs, key)
                            return (
                              <td key={model._id} className="spec-value break-words border-l border-dark-3 px-4 py-3">
                                {value ?? <Missing label={m.table.notAvailable} />}
                              </td>
                            )
                          })}
                        </Row>
                      ))}
                      {features.map((feature) => (
                        <Row key={feature} label={feature}>
                          {compared.map((model) => (
                            <td key={model._id} className="border-l border-dark-3 px-4 py-3">
                              {(model.features ?? []).includes(feature) ? (
                                <>
                                  <Check className="h-4 w-4 text-green-400" />
                                  <span className="sr-only">{m.table.included}</span>
                                </>
                              ) : (
                                <>
                                  <X className="h-4 w-4 text-mid" />
                                  <span className="sr-only">{m.table.notIncluded}</span>
                                </>
                              )}
                            </td>
                          ))}
                        </Row>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-dark-3 bg-black">
                        <td className="sticky left-0 z-10 bg-inherit p-3" />
                        {compared.map((model) => (
                          <td key={model._id} className="border-l border-dark-3 p-3">
                            <Link
                              href={contactHref('purchase', model.name)}
                              className="btn-secondary w-full justify-center text-xs"
                            >
                              {t.common.enquire}
                            </Link>
                          </td>
                        ))}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <tr className="border-t border-dark-3 odd:bg-dark even:bg-black">
      <th
        scope="row"
        className="sticky left-0 z-10 bg-inherit px-4 py-3 align-top text-xs font-normal uppercase tracking-wide text-light"
      >
        {label}
      </th>
      {children}
    </tr>
  )
}
