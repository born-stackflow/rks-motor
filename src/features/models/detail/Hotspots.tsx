'use client'

import { useState } from 'react'
import { SanityImage } from '@/components/sanity/SanityImage'
import type { Hotspot, Image } from '@/lib/sanity/types'
import { cn } from '@/lib/utils'

type Props = {
  image: Image
  alt: string
  hotspots: Hotspot[]
  tag: string
  title: string
  hint: string
  pointLabel: (n: number) => string
}

function HotspotCard({ hotspot }: { hotspot: Hotspot }) {
  return (
    <div className="border border-white/10 bg-black/95 p-5">
      {hotspot.label ? (
        <p className="mb-3 inline-block border border-gold/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
          {hotspot.label}
        </p>
      ) : null}
      {hotspot.title ? (
        <h3 className="mb-2 text-[15px] font-bold uppercase leading-tight tracking-wide text-off-white">{hotspot.title}</h3>
      ) : null}
      {hotspot.description ? <p className="mb-3 text-xs leading-relaxed text-light">{hotspot.description}</p> : null}
      {hotspot.highlight ? <p className="text-sm font-bold tracking-wider text-gold">{hotspot.highlight}</p> : null}
    </div>
  )
}

export function Hotspots({ image, alt, hotspots, tag, title, hint, pointLabel }: Props) {
  const [active, setActive] = useState<number | null>(null)
  const current = active != null ? hotspots[active] : null

  return (
    <section className="bg-black py-20">
      <div className="container">
        <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-red">{tag}</p>
        <h2 className="mb-3 font-display text-[clamp(3rem,7vw,5.5rem)] leading-none text-off-white">{title}</h2>
        <p className="mb-10 text-sm text-light">{hint}</p>

        <div className="relative mx-auto aspect-[16/10] w-full max-w-5xl">
          <SanityImage image={image} alt={alt} fill sizes="(max-width: 1100px) 100vw, 1024px" className="object-contain" />
          {hotspots.map((hotspot, i) => {
            const selected = active === i
            return (
              <div
                key={i}
                className={cn('absolute -translate-x-1/2 -translate-y-1/2', selected ? 'z-30' : 'z-10')}
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              >
                <button
                  type="button"
                  onClick={() => setActive(selected ? null : i)}
                  aria-expanded={selected}
                  aria-label={hotspot.title || hotspot.label || pointLabel(i + 1)}
                  className="relative flex h-11 w-11 items-center justify-center"
                >
                  <span className="absolute h-5 w-5 animate-ping rounded-full bg-gold opacity-50 motion-reduce:animate-none" />
                  <span className="relative block h-4 w-4 rounded-full bg-gold shadow-[0_0_12px_rgba(201,168,76,0.7)]" />
                </button>
                {selected ? (
                  <div
                    className={cn(
                      'absolute hidden w-64 md:block',
                      hotspot.x > 55 ? 'right-11' : 'left-11',
                      hotspot.y > 65 ? 'bottom-11' : 'top-11',
                    )}
                  >
                    <HotspotCard hotspot={hotspot} />
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>

        {current ? (
          <div className="mx-auto mt-6 max-w-5xl md:hidden">
            <HotspotCard hotspot={current} />
          </div>
        ) : null}
      </div>
    </section>
  )
}
