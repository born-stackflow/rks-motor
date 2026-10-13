import type { Metadata } from 'next'
import { sanityClient, queries, urlFor } from '@/lib/sanity'
import type { BlogPostCard, SiteSettings } from '@/lib/sanity'
import NewsClient from './NewsClient'

export const metadata: Metadata = {
  title: 'News & Updates | RKS E-Bikes',
  description: 'Stay up to date with the latest RKS E-Bikes news — product launches, technology deep-dives, events, and industry insights.',
  openGraph: {
    title: 'RKS E-Bikes — News & Updates',
    description: 'Latest news from RKS E-Bikes: model launches, battery technology, events, and more.',
    type: 'website',
  },
}

export const revalidate = 60

export default async function NewsPage() {
  const posts: BlogPostCard[] = await sanityClient
    .fetch(queries.allPosts)
    .catch(() => [])
  const settings: SiteSettings | null = await sanityClient
    .fetch(queries.siteSettings)
    .catch(() => null)

  const bgUrl = (settings?.newsPageBg as any)?.asset
    ? urlFor(settings!.newsPageBg!).width(1600).quality(80).url()
    : undefined

  return <NewsClient posts={posts} bgUrl={bgUrl} />
}
