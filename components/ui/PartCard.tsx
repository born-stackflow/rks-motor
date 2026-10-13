'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from './Badge'
import { ArrowRight, Wrench } from './Icon'
import { ImagePlaceholder } from './ImagePlaceholder'
import { SanityImage, hasImage } from '@/components/sanity/SanityImage'
import { useLanguage } from '@/contexts/LanguageContext'
import { PART_AVAILABILITY, PART_CATEGORIES } from '@/lib/site'
import { formatPrice } from '@/lib/utils'
import type { PartCard as PartCardData } from '@/lib/sanity/types'

const COPY = {
  en: { fits: (n: number) => `Fits ${n} model${n === 1 ? '' : 's'}`, oem: 'OEM' },
  it: { fits: (n: number) => `Compatibile con ${n} modell${n === 1 ? 'o' : 'i'}`, oem: 'OEM' },
}

export function PartCard({ part, index = 0 }: { part: PartCardData; index?: number }) {
  const { t, locale } = useLanguage()
  const availability = part.availability ? PART_AVAILABILITY[part.availability] : null
  const fits = part.compatibleModels?.length ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.08, ease: 'easeOut' }}
      className="group h-full"
    >
      <Link href={`/parts/${part.slug}`} className="block h-full">
        <article className="card overflow-hidden h-full flex flex-col">
          <div className="relative aspect-[4/3] overflow-hidden bg-dark">
            {hasImage(part.image) ? (
              <SanityImage
                image={part.image}
                alt={part.image.alt || part.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <ImagePlaceholder icon={Wrench} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
              {part.partType === 'oem' ? <Badge variant="gold">{COPY[locale].oem}</Badge> : null}
              {availability ? <Badge variant={availability.tone}>{availability.label[locale]}</Badge> : null}
            </div>
            <div className="absolute bottom-3 left-3">
              <Badge variant="dark">{PART_CATEGORIES[part.category]?.[locale] ?? part.category}</Badge>
            </div>
          </div>

          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-lg font-bold text-off-white mb-1 group-hover:text-red transition-colors leading-tight">
              {part.name}
            </h3>
            <p className="text-gold text-xs mb-2 uppercase tracking-wider font-mono">{part.partNumber}</p>
            {fits > 0 ? <p className="text-xs text-mid mb-3">{COPY[locale].fits(fits)}</p> : null}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-dark-3">
              {part.retailPrice ? (
                <span className="text-lg font-bold text-off-white">{formatPrice(part.retailPrice)}</span>
              ) : (
                <span className="text-xs text-mid uppercase tracking-wide">{t.common.priceOnRequest}</span>
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
