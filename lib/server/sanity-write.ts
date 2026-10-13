import 'server-only'
import { createClient, type SanityClient } from '@sanity/client'
import { apiVersion, dataset, projectId } from '@/lib/sanity/env'

let client: SanityClient | null = null

export function getWriteClient(): SanityClient {
  const token = process.env.SANITY_API_TOKEN
  if (!token) throw new Error('SANITY_API_TOKEN is not configured')
  client ??= createClient({ projectId, dataset, apiVersion, token, useCdn: false })
  return client
}
