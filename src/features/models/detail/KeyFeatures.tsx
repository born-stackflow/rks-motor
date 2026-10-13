'use client'

import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SanityImage, hasImage } from '@/components/sanity/SanityImage'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import type { KeyFeature } from '@/lib/sanity/types'
import { cn } from '@/lib/utils'

type Props = { features: KeyFeature[]; tag: string; title: string }

export function KeyFeatures({ features, tag, title }: Props) {
  const [active, setActive] = useState(0)
  const panelId = useId()
  const current = features[active]

  return (
    <section className="bg-dark py-20">
      <div className="container">
        <div className="grid grid-cols-1 overflow-hidden border border-dark-3 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]">
          <div className="flex flex-col bg-dark-2">
            <div className="border-b border-dark-3 p-6 lg:p-8">
              <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-red">{tag}</p>
              <h2 className="font-display text-4xl leading-none text-off-white lg:text-[2.6rem]">{title}</h2>
            </div>
            <ul className="flex-1">
              {features.map((feature, i) => {
                const selected = i === active
                return (
                  <li key={`${feature.title}-${i}`}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      aria-pressed={selected}
                      aria-controls={panelId}
                      className={cn(
                        'group w-full border-b border-dark-3 px-6 py-4 text-left transition-colors lg:px-8',
                        selected ? 'bg-black' : 'hover:bg-black/40',
                      )}
                    >
                      <span className="flex items-center gap-4">
                        <span
                          className={cn(
                            'text-xs font-bold tabular-nums transition-colors',
                            selected ? 'text-red' : 'text-mid group-hover:text-light',
                          )}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={cn(
                            'text-sm font-bold uppercase leading-tight tracking-wider transition-colors',
                            selected ? 'text-off-white' : 'text-light group-hover:text-off-white',
                          )}
                        >
                          {feature.title}
                        </span>
                      </span>
                      {selected ? <span className="mt-3 block h-[2px] w-full bg-red" /> : null}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div id={panelId} aria-live="polite" className="relative min-h-[420px] overflow-hidden bg-black">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                {hasImage(current?.image) ? (
                  <SanityImage
                    image={current.image}
                    alt={current.image.alt || current.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 70vw"
                    className="object-cover"
                  />
                ) : (
                  <ImagePlaceholder />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="mb-3 font-display text-[clamp(3.5rem,8vw,6rem)] leading-none text-gold/90">
                    {String(active + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mb-2 text-xl font-bold uppercase leading-tight tracking-wider text-off-white">
                    {current?.title}
                  </h3>
                  {current?.description ? (
                    <p className="max-w-md text-sm leading-relaxed text-light">{current.description}</p>
                  ) : null}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
