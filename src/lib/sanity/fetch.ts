import 'server-only'
import type { QueryParams } from '@sanity/client'
import { sanityClient } from './client'

export const REVALIDATE_SECONDS = 60

export async function sanityFetch<T>(query: string, params: QueryParams = {}): Promise<T> {
  return sanityClient.fetch<T>(query, params, {
    next: { revalidate: REVALIDATE_SECONDS, tags: ['sanity'] },
  })
}

export async function sanityFetchSafe<T>(query: string, params: QueryParams, fallback: T): Promise<T> {
  try {
    return (await sanityFetch<T | null>(query, params)) ?? fallback
  } catch (err) {
    console.error('[sanity] query failed', err)
    return fallback
  }
}
