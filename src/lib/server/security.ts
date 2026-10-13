import 'server-only'
import type { NextRequest } from 'next/server'
import { SITE_URL } from '@/lib/site'

export function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
}

function allowedOrigins(request: NextRequest): Set<string> {
  const origins = new Set<string>([new URL(SITE_URL).origin, request.nextUrl.origin])
  const host = new URL(SITE_URL).host
  if (!host.startsWith('www.')) origins.add(`https://www.${host}`)
  for (const origin of (process.env.ALLOWED_ORIGINS ?? '').split(',')) {
    if (origin.trim()) origins.add(origin.trim().replace(/\/$/, ''))
  }
  return origins
}

/** Accepts only requests sent by pages of this site; blocks cross-site posts and bare scripts. */
export function isSameSiteRequest(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  if (origin) return allowedOrigins(request).has(origin)
  return request.headers.get('sec-fetch-site') === 'same-origin'
}

type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

/**
 * Fixed-window limiter kept in memory. On serverless platforms each instance has its own window,
 * so this caps bursts from one client rather than enforcing a global quota.
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k)
  }
  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  bucket.count += 1
  return bucket.count <= limit
}
