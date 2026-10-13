export const dynamic = 'force-static'

/** Changes on every deploy, so a new worker replaces the old caches. */
const VERSION = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) || String(Date.now())

const worker = `
const VERSION = ${JSON.stringify(VERSION)}
const STATIC_CACHE = 'rks-static-' + VERSION
const IMAGE_CACHE = 'rks-images-v1'
const MAX_IMAGES = 150

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('rks-static-') && k !== STATIC_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

async function trim(cache, max) {
  const keys = await cache.keys()
  await Promise.all(keys.slice(0, Math.max(0, keys.length - max)).map((key) => cache.delete(key)))
}

async function cacheFirst(cacheName, request, fetchRequest, limit) {
  const cache = await caches.open(cacheName)
  const hit = await cache.match(request, { ignoreVary: true })
  if (hit) return hit
  const response = await fetch(fetchRequest)
  if (!response.ok) throw new Error('uncacheable response ' + response.status)
  cache.put(request, response.clone()).then(() => (limit ? trim(cache, limit) : undefined)).catch(() => {})
  return response
}

// The Sanity CDN only answers CORS requests from the origins allowed in the project (rksitalia.it, not previews or
// localhost). After the first refusal images go straight to the network for the rest of this worker's life.
let imageCaching = true

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return
  const url = new URL(request.url)

  // Hashed build assets never change: serve them from the device.
  if (url.origin === self.location.origin && url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(STATIC_CACHE, request, request).catch(() => fetch(request)))
    return
  }

  // Sanity image URLs embed the asset hash and the transform, so they are immutable too.
  // They are fetched in CORS mode to avoid caching opaque responses.
  if (imageCaching && url.hostname === 'cdn.sanity.io' && url.pathname.startsWith('/images/')) {
    event.respondWith(
      cacheFirst(IMAGE_CACHE, request.url, new Request(request.url, { mode: 'cors', credentials: 'omit' }), MAX_IMAGES)
        .catch(() => {
          imageCaching = false
          return fetch(request)
        }),
    )
  }
  // Pages, RSC payloads, API routes and the Studio always go to the network.
})
`

export function GET() {
  return new Response(worker, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
}
