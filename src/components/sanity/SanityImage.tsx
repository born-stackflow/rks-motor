'use client'

import Image, { type ImageLoader, type ImageProps } from 'next/image'
import { hasImage, urlFor } from '@/lib/sanity/image'
import type { Image as SanityImageValue } from '@/lib/sanity/types'

export { hasImage }

type Props = Omit<ImageProps, 'src' | 'alt' | 'loader' | 'preload'> & {
  image: SanityImageValue | null | undefined
  alt?: string
}

const DEFAULT_QUALITY = 70

/** Lets the Sanity CDN resize images instead of routing them through the Next.js optimizer. */
const sanityLoader: ImageLoader = ({ src, width, quality }) => {
  const url = new URL(src)
  url.searchParams.set('w', String(width))
  url.searchParams.set('q', String(quality ?? DEFAULT_QUALITY))
  url.searchParams.set('fit', 'max')
  url.searchParams.set('auto', 'format')
  return url.toString()
}

/**
 * `priority` marks the LCP candidate: preloaded, fetched with high priority and never lazy.
 * Covering photos show their dominant colour while loading; product shots with transparency do not.
 */
export function SanityImage({ image, alt, priority, className, style, ...props }: Props) {
  if (!hasImage(image)) return null
  const placeholder = image.color && className?.includes('object-cover') ? { backgroundColor: image.color } : undefined
  return (
    <Image
      loader={sanityLoader}
      src={urlFor(image).url()}
      alt={alt ?? image.alt ?? ''}
      className={className}
      style={placeholder ? { ...placeholder, ...style } : style}
      {...(priority ? { preload: true, fetchPriority: 'high', loading: 'eager' } : {})}
      {...props}
    />
  )
}
