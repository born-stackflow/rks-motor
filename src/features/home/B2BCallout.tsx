'use client'

import Link from 'next/link'
import { m } from 'framer-motion'
import { SanityImage, hasImage } from '@/components/sanity/SanityImage'
import { ArrowRight, Building2 } from '@/components/ui/Icon'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { useMessages } from '@/lib/i18n/LanguageContext'
import { homeMessages } from './messages'
import type { Image } from '@/lib/sanity/types'

const EASE = [0.22, 1, 0.36, 1] as const
const SCANLINE = 'linear-gradient(90deg, transparent 0%, rgba(204,0,0,0.12) 30%, rgba(204,0,0,0.06) 70%, transparent 100%)'

export function B2BCallout({ background }: { background?: Image }) {
  const t = useMessages(homeMessages).b2b

  return (
    <section className="relative overflow-hidden bg-black py-16 md:py-20">
      <div aria-hidden="true" className="absolute inset-0">
        {hasImage(background) ? (
          <SanityImage image={background} alt="" fill quality={55} sizes="100vw" className="object-cover object-center" />
        ) : (
          <ImagePlaceholder icon={Building2} />
        )}
      </div>
      <div className="absolute inset-0 bg-black/75" />

      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(180,0,0,0.55)_0%,rgba(120,0,0,0.25)_35%,transparent_70%)]"
        animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-[400px] w-[500px] bg-[radial-gradient(ellipse_at_0%_100%,rgba(140,0,0,0.18)_0%,transparent_65%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {[0, 1, 2, 3].map((i) => (
          <m.div
            key={i}
            className="absolute h-px w-full"
            style={{ top: `${18 + i * 22}%`, background: SCANLINE }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 7 + i * 1.5, repeat: Infinity, ease: 'linear', delay: i * 1.2 }}
          />
        ))}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:radial-gradient(circle,#ffffff_1px,transparent_0)] [background-size:32px_32px]"
      />

      <div className="container relative">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="flex max-w-2xl items-stretch gap-6">
            <m.div
              aria-hidden="true"
              className="w-[3px] flex-shrink-0 self-stretch rounded-full bg-red"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
              style={{ originY: 0 }}
            />

            <div>
              <p className="mb-4 flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center border border-red/50 bg-red/10"
                >
                  <Building2 className="h-4 w-4 text-red" />
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-red">{t.label}</span>
              </p>
              <h2 className="mb-4 font-display text-[clamp(2.2rem,4.5vw,3.8rem)] leading-none tracking-[0.02em] text-off-white">
                {t.title}
              </h2>
              <p className="max-w-lg text-sm leading-relaxed text-light md:text-base">{t.desc}</p>

              <div className="mt-7 flex flex-wrap gap-3 lg:hidden">
                <Link href="/trade/apply" className="btn-primary group inline-flex items-center gap-2">
                  {t.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/trade" className="btn-secondary">
                  {t.learnMore}
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden flex-shrink-0 flex-col items-end gap-4 lg:flex">
            <div className="relative">
              <div aria-hidden="true" className="absolute inset-0 bg-red/35 blur-xl motion-safe:animate-pulse" />
              <Link
                href="/trade/apply"
                className="group relative z-10 flex items-center gap-4 bg-red px-10 py-5 text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors duration-200 hover:bg-red-dark"
              >
                {t.cta}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <Link
              href="/trade"
              className="group flex min-h-10 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-light transition-colors duration-200 hover:text-red"
            >
              {t.learnMore}
              <ArrowRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
