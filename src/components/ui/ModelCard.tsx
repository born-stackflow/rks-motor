'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from './Badge'
import { ArrowRight, Check, Gauge } from './Icon'
import { ImagePlaceholder } from './ImagePlaceholder'
import { SanityImage, hasImage } from '@/components/sanity/SanityImage'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { brandLabel, MODEL_AVAILABILITY } from '@/lib/site'
import { formatPrice } from '@/lib/utils'
import type { ModelCard as ModelCardData } from '@/lib/sanity/types'

type Props = {
  model: ModelCardData
  index?: number
  compare?: { selected: boolean; onToggle: () => void; label: string }
}

export function ModelCard({ model, index = 0, compare }: Props) {
  const { t, locale } = useLanguage()
  const availability = model.availability ? MODEL_AVAILABILITY[model.availability] : null
  const showAvailability = availability && model.availability !== 'in-stock'

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.08, ease: 'easeOut' }}
      className="group relative h-full"
    >
      {compare ? (
        <button
          type="button"
          onClick={compare.onToggle}
          aria-pressed={compare.selected}
          aria-label={`${compare.label}: ${model.name}`}
          title={compare.label}
          className="group/compare absolute top-1 left-1 z-10 w-11 h-11 flex items-center justify-center"
        >
          <span
            className={`w-6 h-6 border-2 flex items-center justify-center transition-colors ${
              compare.selected ? 'bg-red border-red' : 'bg-black/60 border-dark-3 group-hover/compare:border-red'
            }`}
          >
            {compare.selected ? <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} /> : null}
          </span>
        </button>
      ) : null}

      <Link href={`/models/${model.slug}`} className="block h-full">
        <article className="card overflow-hidden h-full flex flex-col">
          <div className="relative aspect-[16/10] overflow-hidden product-shot">
            {hasImage(model.image) ? (
              <SanityImage
                image={model.image}
                alt={model.image.alt || model.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain object-center p-4 product-shot-img"
              />
            ) : (
              <ImagePlaceholder icon={Gauge} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute top-3 right-3 flex gap-2">
              {model.isNew ? <Badge variant="gold">{t.common.new}</Badge> : null}
              {showAvailability ? <Badge variant={availability.tone}>{availability.label[locale]}</Badge> : null}
            </div>
            <div className="absolute bottom-3 left-3">
              <Badge variant="red">{brandLabel(model.brand)}</Badge>
            </div>
          </div>

          <div className="p-5 flex flex-col flex-1">
            {model.tagline ? <p className="text-xs text-mid mb-1 uppercase tracking-wide">{model.tagline}</p> : null}
            <h3 className="font-display text-2xl text-off-white leading-none mb-3 group-hover:text-red transition-colors">
              {model.name}
            </h3>
            {model.range || model.motor ? (
              <p className="text-xs text-light mb-3">{[model.motor, model.range].filter(Boolean).join(' · ')}</p>
            ) : null}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-dark-3">
              {model.price ? (
                <span className="text-xl font-bold text-gold">{formatPrice(model.price)}</span>
              ) : (
                <span className="text-light text-sm">{t.common.priceOnRequest}</span>
              )}
              <span className="flex items-center gap-1 text-sm text-red font-semibold group-hover:gap-2 transition-all">
                {t.common.viewDetails} <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
