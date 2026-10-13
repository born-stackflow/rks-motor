'use client'

import Link from 'next/link'
import { SanityImage, hasImage } from '@/components/sanity/SanityImage'
import { ArrowRight, MapPin } from '@/components/ui/Icon'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { useMessages } from '@/contexts/LanguageContext'
import { homeMessages } from '@/lib/i18n/messages/home'
import type { Image } from '@/lib/sanity/types'
import { SectionTag } from './SectionHeader'

export function DealerTeaser({ background }: { background?: Image }) {
  const t = useMessages(homeMessages).dealer

  return (
    <section className="section-sm relative overflow-hidden bg-dark">
      <div className="container">
        <div className="grid grid-cols-1 overflow-hidden border border-dark-3 lg:grid-cols-2">
          <div aria-hidden="true" className="relative h-64 min-h-[320px] overflow-hidden lg:h-auto">
            {hasImage(background) ? (
              <SanityImage
                image={background}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center"
              />
            ) : (
              <ImagePlaceholder icon={MapPin} />
            )}
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="flex flex-col justify-center bg-dark-2 p-8 sm:p-10 lg:p-14">
            <SectionTag label={t.tag} />
            <h2 className="mb-4 font-display text-4xl leading-none text-off-white md:text-5xl">{t.title}</h2>
            <p className="mb-8 max-w-sm text-base leading-relaxed text-light">{t.desc}</p>
            <Link href="/dealers" className="btn-primary group inline-flex items-center gap-2 self-start">
              {t.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
