import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'
import { apiVersion, dataset, projectId } from './env'

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})

const builder = imageUrlBuilder({ projectId, dataset })

export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format')
}

export function imageUrl(source: SanityImageSource | null | undefined, width: number) {
  if (!source) return null
  return urlFor(source).width(width).fit('max').url()
}
