'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { SanityImage, hasImage } from '@/components/sanity/SanityImage'
import { RichText } from '@/components/sanity/RichText'
import { Badge } from '@/components/ui/Badge'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { ModelCard } from '@/components/ui/ModelCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ArrowRight, Check, ChevronLeft, Download, Gauge, MapPin, Zap } from '@/components/ui/Icon'
import { useLanguage, useLocalized, useMessages } from '@/lib/i18n/LanguageContext'
import { modelDetailMessages } from '@/features/models/messages'
import { MODEL_AVAILABILITY, SPEC_LABELS, brandLabel } from '@/lib/site'
import type { Image, ModelDetail } from '@/lib/sanity/types'
import { cn, formatPrice } from '@/lib/utils'
import { contactHref, specRows, specValue } from '@/features/models/specs'
import { EnquiryActions } from './EnquiryActions'
import { Hotspots } from './Hotspots'
import { KeyFeatures } from './KeyFeatures'

const QUICK_STATS = [
  { key: 'motor', icon: Zap },
  { key: 'maxSpeed', icon: Gauge },
  { key: 'range', icon: Zap },
  { key: 'battery', icon: Zap },
] as const

const loadLightbox = () => import('./Lightbox').then((module) => module.Lightbox)
const Lightbox = dynamic(loadLightbox, { ssr: false })
const warmLightbox = () => void loadLightbox()

export function ModelDetailView({ model }: { model: ModelDetail }) {
  const m = useMessages(modelDetailMessages)
  const { t, locale } = useLanguage()
  const l = useLocalized()

  const colours = model.colours ?? []
  const [colourIndex, setColourIndex] = useState(0)
  const [lightbox, setLightbox] = useState<{ image: Image; alt: string } | null>(null)

  const brand = brandLabel(model.brand)
  const selectedColour = colours[colourIndex]
  const productImage = hasImage(selectedColour?.image) ? selectedColour.image : model.image
  const gallery = (model.gallery ?? []).filter(hasImage)
  const hotspotImage = hasImage(model.hotspotImage) ? model.hotspotImage : productImage
  const keyFeatures = model.keyFeatures ?? []
  const features = model.features ?? []
  const specs = specRows(model.specs)
  const related = model.related ?? []
  const availability = model.availability ? MODEL_AVAILABILITY[model.availability] : null
  const quickStats = QUICK_STATS.flatMap(({ key, icon }) => {
    const value = specValue(model.specs, key)
    return value ? [{ key, icon, value }] : []
  })

  return (
    <div className="min-h-screen bg-black">
      <section className="relative flex min-h-[560px] items-end overflow-hidden md:h-[80vh]">
        {hasImage(model.heroImage) ? (
          <SanityImage image={model.heroImage} alt="" fill priority quality={55} sizes="100vw" className="object-cover object-center" />
        ) : (
          <ImagePlaceholder />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

        <nav aria-label={m.breadcrumb} className="absolute inset-x-0 top-6">
          <div className="container">
            <Link
              href="/models"
              className="inline-flex min-h-10 items-center gap-1 text-xs font-semibold uppercase tracking-widest text-light transition-colors hover:text-red"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> {t.nav.models}
            </Link>
          </div>
        </nav>

        <div className="container relative animate-fade-up pb-14 pt-28">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.4em] text-red">{m.eyebrow(brand)}</p>
          <h1 className="mb-6 break-words font-display text-[clamp(3.5rem,13vw,10rem)] leading-none tracking-[0.02em] text-off-white">
            {model.name}
          </h1>
          {quickStats.length ? (
            <dl className="flex flex-wrap gap-x-8 gap-y-4">
              {quickStats.map(({ key, icon: StatIcon, value }) => (
                <div key={key} className="flex items-center gap-3 border-l-2 border-red pl-4">
                  <StatIcon className="h-4 w-4 text-red" />
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-light">{l(SPEC_LABELS[key])}</dt>
                    <dd className="text-sm font-bold text-off-white">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </section>

      <section className="bg-black py-16">
        <div className="container grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px]">
          <div className="min-w-0">
            <button
              type="button"
              disabled={!hasImage(productImage)}
              onClick={() => hasImage(productImage) && setLightbox({ image: productImage, alt: model.name })}
              onPointerEnter={warmLightbox}
              onFocus={warmLightbox}
              aria-label={m.enlarge}
              className="product-shot group relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden disabled:cursor-default"
            >
              {hasImage(productImage) ? (
                <SanityImage
                  key={colourIndex}
                  image={productImage}
                  alt={selectedColour ? `${model.name} — ${selectedColour.name}` : model.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="product-shot-img animate-fade-up object-contain p-6"
                />
              ) : (
                <ImagePlaceholder icon={Gauge} />
              )}
              {selectedColour ? (
                <span className="absolute left-3 top-3 flex items-center gap-2 border border-white/10 bg-black/70 px-3 py-1.5 backdrop-blur-sm">
                  {selectedColour.hex ? (
                    <span className="h-3 w-3 rounded-full border border-white/30" style={{ backgroundColor: selectedColour.hex }} />
                  ) : null}
                  <span className="text-[10px] font-bold uppercase tracking-widest text-off-white">{selectedColour.name}</span>
                </span>
              ) : null}
            </button>

            {colours.length > 1 ? (
              <fieldset className="mt-4">
                <legend className="mb-2 text-[10px] uppercase tracking-[0.25em] text-light">
                  {m.colour} — <span className="text-off-white">{selectedColour?.name}</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {colours.map((colour, i) => {
                    const selected = i === colourIndex
                    return (
                      <button
                        key={`${colour.name}-${i}`}
                        type="button"
                        onClick={() => setColourIndex(i)}
                        aria-pressed={selected}
                        aria-label={m.showColour(colour.name)}
                        title={colour.name}
                        className={cn(
                          'relative h-12 w-16 overflow-hidden border-2 transition-all',
                          selected
                            ? 'border-red shadow-[0_0_8px_rgba(204,0,0,0.4)]'
                            : 'border-dark-3 opacity-70 hover:border-red/50 hover:opacity-100',
                        )}
                      >
                        {hasImage(colour.image) ? (
                          <SanityImage image={colour.image} alt="" fill sizes="64px" className="object-cover" />
                        ) : (
                          <span className="absolute inset-0" style={{ backgroundColor: colour.hex ?? '#333' }} />
                        )}
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            ) : null}
          </div>

          <div className="h-fit space-y-4 lg:sticky lg:top-[88px]">
            <div className="flex flex-wrap gap-2">
              <Badge variant="red">{brand}</Badge>
              {model.isNew ? <Badge variant="gold">{t.common.new}</Badge> : null}
              {availability ? <Badge variant={availability.tone}>{availability.label[locale]}</Badge> : null}
            </div>
            <h2 className="font-display text-[clamp(2.2rem,4vw,3rem)] leading-none tracking-[0.02em] text-off-white">
              {model.name}
            </h2>
            {model.tagline ? <p className="text-sm italic text-light">{model.tagline}</p> : null}

            <div className="border border-dark-3 bg-dark p-6">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-light">{m.price}</p>
              {model.price != null ? (
                <p className="font-display text-[clamp(2.8rem,6vw,4rem)] leading-none text-gold">{formatPrice(model.price)}</p>
              ) : (
                <p className="text-xl text-off-white">{t.common.priceOnRequest}</p>
              )}
              {model.b2cPriceNote ? <p className="mt-2 text-xs leading-relaxed text-light">{model.b2cPriceNote}</p> : null}
            </div>

            <EnquiryActions model={model} />

            {model.specSheetUrl ? (
              <a
                href={model.specSheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-red transition-colors hover:text-red-light"
              >
                <Download className="h-4 w-4" /> {m.specSheet}
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {model.description?.length ? (
        <section className="bg-dark py-20">
          <div className="container">
            <SectionHeading tag={m.overview.tag} title={m.overview.title(model.name)} />
            <div className="mt-10 max-w-3xl">
              <RichText value={model.description} />
            </div>
          </div>
        </section>
      ) : null}

      {gallery.length ? (
        <section className="bg-black py-16">
          <div className="container">
            <p className="mb-2 text-[11px] uppercase tracking-[0.35em] text-red">{m.gallery.tag}</p>
            <h2 className="mb-8 font-display text-4xl leading-none text-off-white">{m.gallery.title}</h2>
            <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
              {gallery.map((image, i) => {
                const alt = image.alt || m.gallery.photo(model.name, i + 1)
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => setLightbox({ image, alt })}
                      onPointerEnter={warmLightbox}
                      onFocus={warmLightbox}
                      aria-label={`${m.enlarge}: ${alt}`}
                      className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-dark"
                    >
                      <SanityImage
                        image={image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      ) : null}

      {specs.length ? (
        <section className="bg-dark py-20">
          <div className="container">
            <SectionHeading tag={m.specs.tag} title={m.specs.title} />
            <dl className="mt-10 grid border-l border-t border-dark-3 lg:grid-cols-2">
              {specs.map(({ key, value }) => (
                <div
                  key={key}
                  className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 border-b border-r border-dark-3 bg-black px-5 py-4"
                >
                  <dt className="spec-label text-xs">{l(SPEC_LABELS[key])}</dt>
                  <dd className="spec-value break-words">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      {model.hotspots?.length && hasImage(hotspotImage) ? (
        <Hotspots
          image={hotspotImage}
          alt={model.name}
          hotspots={model.hotspots}
          tag={m.hotspots.tag}
          title={m.hotspots.title}
          hint={m.hotspots.hint}
          pointLabel={m.hotspots.point}
        />
      ) : null}

      {keyFeatures.length ? (
        <KeyFeatures features={keyFeatures} tag={m.highlights.tag} title={m.highlights.title} />
      ) : features.length ? (
        <section className="bg-black py-20">
          <div className="container">
            <SectionHeading tag={m.features.tag} title={m.features.title} />
            <ul className="mt-10 grid grid-cols-1 border-l border-t border-dark-3 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-4 border-b border-r border-dark-3 p-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-red/30 bg-red/10">
                    <Check className="h-4 w-4 text-red" />
                  </span>
                  <span className="text-sm leading-snug text-off-white">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="bg-dark py-20">
          <div className="container">
            <SectionHeading tag={m.related.tag} title={m.related.title(brand)} />
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item, i) => (
                <li key={item._id}>
                  <ModelCard model={item} index={i} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="bg-black py-16">
        <div className="container">
          <div className="flex flex-col gap-8 border-l-4 border-red bg-dark-2 p-6 md:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="mb-3 font-display text-4xl leading-none text-off-white md:text-5xl">{m.cta.title(model.name)}</h2>
              <p className="leading-relaxed text-light">{m.cta.text}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href={contactHref('purchase', model.name)} className="btn-primary justify-center">
                {m.requestInfo} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={contactHref('test-ride', model.name)} className="btn-secondary justify-center">
                {m.testRide}
              </Link>
              <Link href="/dealers" className="btn-ghost justify-center">
                <MapPin className="h-4 w-4" /> {m.cta.dealers}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {lightbox ? (
        <Lightbox
        image={lightbox.image}
        alt={lightbox.alt}
        label={m.lightbox.label(model.name)}
        closeLabel={m.lightbox.close}
        onClose={() => setLightbox(null)}
        />
      ) : null}
    </div>
  )
}
