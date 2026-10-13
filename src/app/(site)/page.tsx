import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/sanity/data'
import { sanityFetchSafe } from '@/lib/sanity/fetch'
import {
  allModelsQuery,
  featuredModelsQuery,
  featuredPartsQuery,
  latestPostsQuery,
  partCategorySummaryQuery,
} from '@/lib/sanity/queries'
import type { ModelCard, PartCard, PartCategorySummary, PostCard } from '@/lib/sanity/types'
import { HomeView, type HomeData } from '@/features/home/HomeView'

export const revalidate = 60

const MODEL_LIMIT = 6
const PART_LIMIT = 3
const POST_LIMIT = 3
const TILE_CATEGORIES = ['motor', 'battery', 'brakes', 'accessories'] as const

const DEFAULT_TITLE = 'RKS | Ape Ryder, RKS & Skyjet e-bikes'
const DEFAULT_DESCRIPTION =
  'Discover Ape Ryder, RKS and Skyjet e-bikes, genuine spare parts and accessories, and the RKS partner programme for dealers and distributors.'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    title: { absolute: settings?.metaTitle || DEFAULT_TITLE },
    description: settings?.metaDescription || DEFAULT_DESCRIPTION,
    alternates: { canonical: '/' },
  }
}

async function getHomeModels() {
  const featured = await sanityFetchSafe<ModelCard[]>(featuredModelsQuery, {}, [])
  if (featured.length > 0) return featured.slice(0, MODEL_LIMIT)
  const all = await sanityFetchSafe<ModelCard[]>(allModelsQuery, {}, [])
  return all.slice(0, MODEL_LIMIT)
}

export default async function HomePage() {
  const [settings, models, parts, summary, posts] = await Promise.all([
    getSiteSettings(),
    getHomeModels(),
    sanityFetchSafe<PartCard[]>(featuredPartsQuery, {}, []),
    sanityFetchSafe<PartCategorySummary>(partCategorySummaryQuery, {}, []),
    sanityFetchSafe<PostCard[]>(latestPostsQuery, {}, []),
  ])

  const data: HomeData = {
    heroSlides: settings?.heroSlides ?? [],
    stats: (settings?.statsBar ?? []).filter((stat) => stat?.value && stat?.label),
    models,
    parts: parts.slice(0, PART_LIMIT),
    partTiles: TILE_CATEGORIES.map((category) => {
      const entry = summary.find((item) => item.category === category)
      return {
        category,
        count: entry?.count ?? 0,
        image: settings?.partsTiles?.[category] ?? entry?.image,
      }
    }),
    posts: posts.slice(0, POST_LIMIT),
    backgrounds: {
      parts: settings?.partsSectionBg,
      why: settings?.whySectionBg,
      dealer: settings?.dealerSectionBg,
      b2b: settings?.b2bSectionBg,
    },
  }

  return <HomeView data={data} />
}
