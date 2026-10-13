'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { SanityImage, hasImage } from '@/components/sanity/SanityImage'
import { ArrowRight, Wrench } from '@/components/ui/Icon'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { useLocalized, useMessages } from '@/lib/i18n/LanguageContext'
import { homeMessages } from './messages'
import { PART_CATEGORIES } from '@/lib/site'
import type { Image, PartCategory } from '@/lib/sanity/types'
import { ParallaxBg } from './ParallaxBg'
import { SECTION_TITLE, SectionTag } from './SectionHeader'

export type PartTile = { category: PartCategory; count: number; image?: Image }

const EASE = [0.22, 1, 0.36, 1] as const

export function PartsSection({ tiles, background }: { tiles: PartTile[]; background?: Image }) {
  const t = useMessages(homeMessages).parts
  const localize = useLocalized()

  return (
    <section className="section relative overflow-hidden bg-dark">
      <ParallaxBg image={background} opacity={0.08} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {[1, 2, 3, 4].map((line) => (
          <div key={line} className="absolute inset-y-0 w-px bg-red/10" style={{ left: `${line * 20}%` }} />
        ))}
      </div>

      <div className="container relative">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionTag label={t.tag} />
            <h2 className={`${SECTION_TITLE} mb-4`}>{t.title}</h2>
            <p className="mb-8 max-w-md text-base leading-relaxed text-light">{t.subtitle}</p>

            <ul className="mb-8 space-y-3">
              {t.points.map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-4 w-4 flex-shrink-0 items-center justify-center border border-red/50 bg-red/10"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-red" />
                  </span>
                  <span className="text-sm text-light">{point}</span>
                </li>
              ))}
            </ul>

            <Link href="/parts" className="btn-primary group inline-flex items-center gap-2">
              {t.browse}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <ul aria-label={t.categoriesLabel} className="grid grid-cols-2 gap-3">
            {tiles.map((tile, i) => {
              const label = localize(PART_CATEGORIES[tile.category])
              return (
                <motion.li
                  key={tile.category}
                  initial={{ scale: 0.94 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: EASE }}
                >
                  <Link
                    href={`/parts?category=${tile.category}`}
                    className="group relative block aspect-square overflow-hidden bg-dark-3"
                  >
                    {hasImage(tile.image) ? (
                      <SanityImage
                        image={tile.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="object-cover opacity-50 transition-all duration-700 group-hover:scale-110 group-hover:opacity-70 motion-reduce:group-hover:scale-100"
                      />
                    ) : (
                      <ImagePlaceholder icon={Wrench} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 border border-transparent transition-colors duration-300 group-hover:border-red/40" />
                    <div className="absolute bottom-0 left-0 p-4">
                      <p className="text-sm font-bold uppercase tracking-wide text-off-white transition-colors group-hover:text-red">
                        {label}
                      </p>
                      {tile.count > 0 ? <p className="mt-0.5 text-xs text-light">{t.count(tile.count)}</p> : null}
                    </div>
                    <div
                      aria-hidden="true"
                      className="absolute right-3 top-3 flex h-7 w-7 translate-x-2 items-center justify-center bg-red opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    >
                      <ArrowRight className="h-3.5 w-3.5 text-white" />
                    </div>
                  </Link>
                </motion.li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
