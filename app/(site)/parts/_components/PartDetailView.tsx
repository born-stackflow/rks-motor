'use client'

import { useState, type ComponentType, type ReactNode } from 'react'
import Link from 'next/link'
import { RichText } from '@/components/sanity/RichText'
import { SanityImage, hasImage } from '@/components/sanity/SanityImage'
import { Badge } from '@/components/ui/Badge'
import { ArrowRight, Check, ChevronRight, Clock, Gauge, Package, ShoppingCart, Wrench } from '@/components/ui/Icon'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { PartCard } from '@/components/ui/PartCard'
import { useLanguage, useMessages } from '@/contexts/LanguageContext'
import { cart } from '@/lib/cart'
import { partsMessages } from '@/lib/i18n/messages/parts'
import { imageUrl } from '@/lib/sanity/client'
import type { Locale } from '@/lib/site'
import { brandLabel, PART_AVAILABILITY, PART_CATEGORIES, PART_TYPES } from '@/lib/site'
import type { Brand, Image, PartCard as PartCardData, PartDetail } from '@/lib/sanity/types'
import { cn, formatPrice } from '@/lib/utils'
import { PART_ENQUIRY_ID, PartEnquirySection } from './PartEnquirySection'

const SPEC_UNITS: Record<string, string> = {
  length: 'mm',
  width: 'mm',
  height: 'mm',
  weight: 'g',
  boreDiameter: 'mm',
  stroke: 'mm',
  operatingTempMin: '°C',
  operatingTempMax: '°C',
  pressureRating: 'bar',
  voltage: 'V',
  wattage: 'W',
  amperage: 'A',
  torqueSpec: 'Nm',
  padThickness: 'mm',
  wearLimitThickness: 'mm',
  springRate: 'N/mm',
  lumenOutput: 'lm',
  colourTemperature: 'K',
}

export type CompatibleModel = { name: string; slug: string; brand: Brand; image?: Image }

/** The part page data, with the expanded compatible models and the related parts always present. */
export type PartPageData = Omit<PartDetail, 'compatibleModels' | 'related'> & {
  compatibleModels: CompatibleModel[]
  related: PartCardData[]
}

/** "brakeFluidCompatibility" → "Brake fluid compatibility", for fields added to the CMS after this page. */
function humanize(key: string) {
  const words = key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

function specRows(part: PartPageData, labels: Record<string, string>, locale: Locale) {
  const number = new Intl.NumberFormat(locale === 'it' ? 'it-IT' : 'en-GB')
  const entries: Array<[string, unknown]> = [
    ['material', part.material],
    ['surfaceFinish', part.surfaceFinish],
    ['coating', part.coating],
    ...Object.entries(part.dimensions ?? {}),
    ...Object.entries(part.technicalSpecs ?? {}),
  ]
  return entries.flatMap(([key, value]) => {
    if (key.startsWith('_')) return []
    let display: string | null = null
    if (typeof value === 'number' && Number.isFinite(value)) {
      display = [number.format(value), SPEC_UNITS[key]].filter(Boolean).join(' ')
    } else if (typeof value === 'string' && value.trim()) {
      display = value.trim()
    }
    return display ? [{ key, label: labels[key] ?? humanize(key), value: display }] : []
  })
}

export function PartDetailView({ part, models }: { part: PartPageData; models: string[] }) {
  const { t, locale } = useLanguage()
  const messages = useMessages(partsMessages)
  const m = messages.detail
  const [active, setActive] = useState(0)
  const [added, setAdded] = useState(false)

  const images = (part.images ?? []).filter(hasImage)
  const current = images[active] ?? images[0]
  const availability = part.availability ? PART_AVAILABILITY[part.availability] : null
  const category = PART_CATEGORIES[part.category]
  const specs = specRows(part, messages.specs, locale)
  const compatible = part.compatibleModels
  const years =
    part.yearRangeFrom && part.yearRangeTo
      ? `${part.yearRangeFrom}–${part.yearRangeTo}`
      : part.yearRangeFrom
        ? m.yearsFrom(part.yearRangeFrom)
        : part.yearRangeTo
          ? m.yearsTo(part.yearRangeTo)
          : null
  const hasCompatibility = compatible.length > 0 || !!years || !!part.fitmentNotes?.trim()
  const includes = (part.packageIncludes ?? []).filter((item) => item.trim())
  const codes = [
    { label: m.partNumber, value: part.partNumber },
    { label: m.manufacturerPartNumber, value: part.manufacturerPartNumber },
    { label: m.replacesPartNumber, value: part.replacesPartNumber },
  ].filter((code) => code.value?.trim())

  function addToList() {
    const cover = images[0] ?? part.image
    cart.add({
      id: part._id,
      kind: 'part',
      name: part.name,
      slug: part.slug,
      price: part.retailPrice,
      image: hasImage(cover) ? (imageUrl(cover, 400) ?? undefined) : undefined,
    })
    setAdded(true)
  }

  return (
    <>
      <div className="border-b border-dark-3 bg-dark">
        <nav aria-label={m.breadcrumb} className="container py-4">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs uppercase tracking-wider text-light">
            <li>
              <Link href="/" className="hover:text-red transition-colors">
                {t.common.home}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3 w-3" />
            </li>
            <li>
              <Link href="/parts" className="hover:text-red transition-colors">
                {m.parts}
              </Link>
            </li>
            {category ? (
              <>
                <li aria-hidden="true">
                  <ChevronRight className="h-3 w-3" />
                </li>
                <li>
                  <Link href={`/parts?category=${part.category}`} className="hover:text-red transition-colors">
                    {category[locale]}
                  </Link>
                </li>
              </>
            ) : null}
            <li aria-hidden="true">
              <ChevronRight className="h-3 w-3" />
            </li>
            <li aria-current="page" className="min-w-0 truncate text-off-white">
              {part.name}
            </li>
          </ol>
        </nav>
      </div>

      <div className="section-sm bg-black">
        <div className="container grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden border border-dark-3 product-shot">
              {current ? (
                <SanityImage
                  image={current}
                  alt={current.alt || m.imageAlt(part.name, active + 1)}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-6"
                />
              ) : (
                <ImagePlaceholder icon={Wrench} />
              )}
            </div>
            {images.length > 1 ? (
              <ul aria-label={m.galleryLabel} className="mt-3 flex flex-wrap gap-2">
                {images.map((image, index) => (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      aria-label={m.showImage(index + 1, images.length)}
                      aria-current={index === active ? 'true' : undefined}
                      className={cn(
                        'relative block h-16 w-20 overflow-hidden border bg-dark transition-colors',
                        index === active ? 'border-red' : 'border-dark-3 hover:border-light',
                      )}
                    >
                      <SanityImage image={image} alt="" fill sizes="80px" className="object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {category ? <Badge variant="dark">{category[locale]}</Badge> : null}
              {PART_TYPES[part.partType] ? (
                <Badge variant={part.partType === 'oem' ? 'gold' : 'outline'}>{PART_TYPES[part.partType][locale]}</Badge>
              ) : null}
              {availability ? <Badge variant={availability.tone}>{availability.label[locale]}</Badge> : null}
            </div>
            <h1 className="font-display text-5xl md:text-6xl leading-none text-off-white">{part.name}</h1>
            <span className="heading-underline" />

            {codes.length ? (
              <dl className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {codes.map((code) => (
                  <div key={code.label}>
                    <dt className="text-[11px] uppercase tracking-widest text-light">{code.label}</dt>
                    <dd className="mt-0.5 break-all font-mono text-sm text-gold">{code.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <div className="mt-8 border-y border-dark-3 py-6">
              <p className="text-[11px] uppercase tracking-widest text-light">{m.price}</p>
              {part.retailPrice ? (
                <p className="mt-1 font-display text-5xl leading-none text-off-white">{formatPrice(part.retailPrice)}</p>
              ) : (
                <p className="mt-1 text-lg font-semibold uppercase tracking-wide text-off-white">{t.common.priceOnRequest}</p>
              )}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={addToList} className="btn-primary justify-center">
                  <ShoppingCart className="h-4 w-4" />
                  {m.addToList}
                </button>
                <a href={`#${PART_ENQUIRY_ID}`} className="btn-secondary justify-center">
                  {m.askAbout}
                </a>
              </div>
              <p role="status" className="mt-4 min-h-6 text-sm text-light">
                {added ? (
                  <span className="inline-flex flex-wrap items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    {m.added}
                    <Link href="/cart" className="font-semibold text-red-light underline underline-offset-4 hover:text-off-white">
                      {m.viewList}
                    </Link>
                  </span>
                ) : null}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-light">{m.noOnlinePayment}</p>
            </div>

            <dl className="mt-6 space-y-5">
              {part.leadTime?.trim() ? (
                <InfoRow icon={Clock} label={m.leadTime}>
                  {part.leadTime}
                </InfoRow>
              ) : null}
              {part.soldAs || part.quantityInPackage || includes.length ? (
                <InfoRow icon={Package} label={m.package}>
                  {[part.soldAs ? m.soldAs[part.soldAs] : null, part.quantityInPackage ? m.piecesPerPack(part.quantityInPackage) : null]
                    .filter(Boolean)
                    .join(' · ')}
                  {includes.length ? (
                    <>
                      <span className="mt-2 block text-[11px] uppercase tracking-widest text-light">{m.includes}</span>
                      <ul className="mt-1 list-disc space-y-1 pl-5 marker:text-red">
                        {includes.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </InfoRow>
              ) : null}
              {part.warranty?.trim() ? (
                <InfoRow icon={Check} label={m.warranty}>
                  {part.warranty}
                </InfoRow>
              ) : null}
            </dl>
          </div>
        </div>
      </div>

      {part.description?.length ? (
        <section aria-labelledby="part-description" className="section-sm border-t border-dark-3 bg-black">
          <div className="container max-w-3xl">
            <h2 id="part-description" className="font-display text-4xl leading-none text-off-white mb-6">
              {m.description}
            </h2>
            <RichText value={part.description} />
          </div>
        </section>
      ) : null}

      <div className="section-sm border-t border-dark-3 bg-dark">
        <div className="container grid gap-12 lg:grid-cols-2">
          {specs.length ? (
            <div>
              <h2 className="font-display text-4xl leading-none text-off-white mb-6">{m.specs}</h2>
              <dl className="border-t border-dark-3">
                {specs.map((row) => (
                  <div key={row.key} className="flex items-baseline justify-between gap-4 border-b border-dark-3 py-3">
                    <dt className="text-sm text-light">{row.label}</dt>
                    <dd className="text-right font-mono text-sm text-off-white">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          <div className={cn(!specs.length && 'lg:col-span-2 max-w-3xl')}>
            <h2 className="font-display text-4xl leading-none text-off-white mb-6">{m.compatibility}</h2>
            {hasCompatibility ? (
              <div className="space-y-6">
                {compatible.length ? (
                  <div>
                    <h3 className="label">{m.compatibleModels}</h3>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {compatible.map((model) => (
                        <li key={model.slug}>
                          <Link
                            href={`/models/${model.slug}`}
                            className="group flex min-h-16 items-center gap-3 border border-dark-3 bg-black p-2 pr-4 transition-colors hover:border-red"
                          >
                            <span className="relative h-12 w-16 shrink-0 overflow-hidden product-shot">
                              {hasImage(model.image) ? (
                                <SanityImage image={model.image} alt="" fill sizes="64px" className="object-contain p-1" />
                              ) : (
                                <ImagePlaceholder icon={Gauge} />
                              )}
                            </span>
                            <span className="min-w-0">
                              <span className="block text-[11px] uppercase tracking-widest text-light">
                                {brandLabel(model.brand)}
                              </span>
                              <span className="block truncate font-semibold text-off-white group-hover:text-red transition-colors">
                                {model.name}
                              </span>
                            </span>
                            <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-light group-hover:text-red" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {years ? (
                  <div>
                    <h3 className="label">{m.years}</h3>
                    <p className="font-mono text-off-white">{years}</p>
                  </div>
                ) : null}
                {part.fitmentNotes?.trim() ? (
                  <div>
                    <h3 className="label">{m.fitmentNotes}</h3>
                    <p className="whitespace-pre-line leading-relaxed text-light">{part.fitmentNotes}</p>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="leading-relaxed text-light">
                {m.noCompatibility}{' '}
                <a href={`#${PART_ENQUIRY_ID}`} className="font-semibold text-red-light underline underline-offset-4 hover:text-off-white">
                  {m.askAbout}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>

      {part.related.length ? (
        <section aria-labelledby="part-related" className="section-sm border-t border-dark-3 bg-black">
          <div className="container">
            <h2 id="part-related" className="font-display text-4xl leading-none text-off-white mb-8">
              {m.related}
            </h2>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {part.related.map((related, index) => (
                <li key={related._id}>
                  <PartCard part={related} index={index} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <PartEnquirySection part={{ name: part.name, partNumber: part.partNumber }} models={models} />
    </>
  )
}

function InfoRow({
  icon: IconCmp,
  label,
  children,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex gap-3">
      <IconCmp className="mt-0.5 h-5 w-5 shrink-0 text-red" />
      <div className="min-w-0">
        <dt className="text-[11px] uppercase tracking-widest text-light">{label}</dt>
        <dd className="mt-1 text-sm leading-relaxed text-off-white">{children}</dd>
      </div>
    </div>
  )
}
