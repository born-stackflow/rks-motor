import { SPEC_ORDER } from '@/lib/site'
import type { ModelAvailability, ModelSpecs } from '@/lib/sanity/types'

export function specValue(specs: ModelSpecs | undefined, key: string): string | undefined {
  const raw = specs?.[key as keyof ModelSpecs]
  if (raw === undefined || raw === null || raw === '') return undefined
  return typeof raw === 'number' ? `${raw} km/h` : raw
}

export function specRows(specs: ModelSpecs | undefined) {
  return SPEC_ORDER.flatMap((key) => {
    const value = specValue(specs, key)
    return value ? [{ key, value }] : []
  })
}

export function contactHref(type: 'purchase' | 'test-ride', modelName: string) {
  return `/contact?${new URLSearchParams({ type, model: modelName }).toString()}`
}

export const SCHEMA_AVAILABILITY: Record<ModelAvailability, string> = {
  'in-stock': 'https://schema.org/InStock',
  'pre-order': 'https://schema.org/PreOrder',
  'coming-soon': 'https://schema.org/PreOrder',
  discontinued: 'https://schema.org/Discontinued',
}
