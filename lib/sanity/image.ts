import type { Image } from './types'

export function hasImage(image: Image | null | undefined): image is Image {
  return !!image && typeof image === 'object' && 'asset' in image && !!image.asset
}
