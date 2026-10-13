import type { Metadata } from 'next'
import { sanityFetchSafe } from '@/lib/sanity/fetch'
import { getSiteSettings } from '@/lib/sanity/data'
import { allPostsQuery } from '@/lib/sanity/queries'
import type { PostCard } from '@/lib/sanity/types'
import { NewsList } from '@/features/news/NewsList'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'News',
  description: 'Launches, events and stories from the Ape Ryder, RKS and Skyjet e-bike world.',
  alternates: { canonical: '/news' },
}

export default async function NewsPage() {
  const [posts, settings] = await Promise.all([
    sanityFetchSafe<PostCard[]>(allPostsQuery, {}, []),
    getSiteSettings(),
  ])

  return <NewsList posts={posts} heroImage={settings?.pageBackgrounds?.news ?? null} />
}
