import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'
import { dataset, projectId } from './env'
import type { Image } from './types'

/** Image URL helpers live apart from the API client so client components do not ship @sanity/client. */
const builder = createImageUrlBuilder({ projectId, dataset })

export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format')
}

export function imageUrl(source: SanityImageSource | null | undefined, width: number) {
  if (!source) return null
  return urlFor(source).width(width).fit('max').url()
}

export function hasImage(image: Image | null | undefined): image is Image {
  return !!image && typeof image === 'object' && 'asset' in image && !!image.asset
}
