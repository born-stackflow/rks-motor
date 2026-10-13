import type { MetadataRoute } from 'next'
import { sanityFetchSafe } from '@/lib/sanity/fetch'
import { sitemapQuery } from '@/lib/sanity/queries'
import { SITE_URL } from '@/lib/site'

export const revalidate = 3600

type Entry = { slug: string; _updatedAt: string }
type SitemapData = { models: Entry[]; parts: Entry[]; posts: Entry[] }

const STATIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: 'weekly' | 'monthly' }> = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/models', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/compare', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/prices', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/parts', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/dealers', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/news', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/media', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/trade', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/trade/apply', priority: 0.5, changeFrequency: 'monthly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await sanityFetchSafe<SitemapData>(sitemapQuery, {}, { models: [], parts: [], posts: [] })

  const dynamic = (prefix: string, entries: Entry[], priority: number): MetadataRoute.Sitemap =>
    entries.map((entry) => ({
      url: `${SITE_URL}${prefix}/${entry.slug}`,
      lastModified: new Date(entry._updatedAt),
      changeFrequency: 'weekly',
      priority,
    }))

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${SITE_URL}${route.path}`,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...dynamic('/models', data.models, 0.8),
    ...dynamic('/parts', data.parts, 0.6),
    ...dynamic('/news', data.posts, 0.6),
  ]
}
