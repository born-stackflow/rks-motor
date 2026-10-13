import type { ReactNode } from 'react'
import { SanityImage } from '@/components/sanity/SanityImage'
import { hasImage } from '@/lib/sanity/image'
import { ImagePlaceholder } from './ImagePlaceholder'
import type { Image } from '@/lib/sanity/types'
import { cn } from '@/lib/utils'

type Props = {
  eyebrow: string
  title: string
  subtitle?: string
  image?: Image | null
  children?: ReactNode
  size?: 'md' | 'lg'
}

export function PageHero({ eyebrow, title, subtitle, image, children, size = 'md' }: Props) {
  return (
    <section
      className={cn(
        'relative overflow-hidden',
        size === 'lg' ? 'h-[55vh] min-h-[380px]' : 'h-[40vh] min-h-[280px]',
      )}
    >
      {hasImage(image) ? (
        <SanityImage image={image} alt="" fill priority quality={55} sizes="100vw" className="object-cover" />
      ) : (
        <ImagePlaceholder />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />
      <div className="absolute inset-0 flex items-center">
        <div className="container animate-fade-up">
          <p className="text-red text-xs font-semibold uppercase tracking-[0.3em] mb-3">{eyebrow}</p>
          <h1 className="font-display text-off-white leading-none mb-3 text-[clamp(3rem,7vw,6rem)] tracking-[0.02em]">
            {title}
          </h1>
          <div className="h-[3px] w-[60px] bg-red" />
          {subtitle ? <p className="text-light text-base md:text-lg max-w-2xl mt-5 leading-relaxed">{subtitle}</p> : null}
          {children}
        </div>
      </div>
    </section>
  )
}
