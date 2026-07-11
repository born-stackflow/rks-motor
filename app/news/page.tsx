import type { Metadata } from 'next'
import { sanityClient, queries } from '@/lib/sanity'
import type { BlogPostCard } from '@/lib/sanity'
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

  return <NewsClient posts={posts} />
}
