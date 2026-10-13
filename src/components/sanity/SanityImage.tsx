'use client'

import Image, { type ImageLoader, type ImageProps } from 'next/image'
import { urlFor } from '@/lib/sanity/client'
import type { Image as SanityImageValue } from '@/lib/sanity/types'
import { hasImage } from '@/lib/sanity/image'

export { hasImage }

type Props = Omit<ImageProps, 'src' | 'alt' | 'loader'> & {
  image: SanityImageValue | null | undefined
  alt?: string
}

/** Lets the Sanity CDN resize images instead of routing them through the Next.js optimizer. */
const sanityLoader: ImageLoader = ({ src, width, quality }) => {
  const url = new URL(src)
  url.searchParams.set('w', String(width))
  url.searchParams.set('q', String(quality ?? 80))
  url.searchParams.set('fit', 'max')
  url.searchParams.set('auto', 'format')
  return url.toString()
}

export function SanityImage({ image, alt, ...props }: Props) {
  if (!hasImage(image)) return null
  return <Image loader={sanityLoader} src={urlFor(image).url()} alt={alt ?? image.alt ?? ''} {...props} />
}
