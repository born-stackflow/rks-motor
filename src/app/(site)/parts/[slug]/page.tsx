import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { imageUrl } from '@/lib/sanity/client'
import { getNavModels } from '@/lib/sanity/data'
import { sanityFetchSafe } from '@/lib/sanity/fetch'
import { partBySlugQuery, partSlugsQuery } from '@/lib/sanity/queries'
import type { Image } from '@/lib/sanity/types'
import { PART_CATEGORIES } from '@/lib/site'
import { PartDetailView, type PartPageData } from '@/features/parts/PartDetailView'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 60

type PartQueryResult = Omit<PartPageData, 'compatibleModels' | 'related'> & {
  compatibleModels?: Array<PartPageData['compatibleModels'][number] | null> | null
  related?: Array<PartPageData['related'][number] | null> | null
}

const hasAsset = (image: Image | null | undefined): image is Image =>
  !!image && typeof image === 'object' && 'asset' in image && !!image.asset

/** Expanded references resolve to null when the referenced document was deleted. */
const hasSlug = <T extends { slug?: string }>(doc: T | null): doc is T => !!doc?.slug

const getPart = cache(async (slug: string): Promise<PartPageData | null> => {
  const part = await sanityFetchSafe<PartQueryResult | null>(partBySlugQuery, { slug }, null)
  if (!part) return null
  return {
    ...part,
    compatibleModels: (part.compatibleModels ?? []).filter(hasSlug),
    related: (part.related ?? []).filter(hasSlug),
  }
})

export async function generateStaticParams() {
  const slugs = await sanityFetchSafe<string[]>(partSlugsQuery, {}, [])
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const part = await getPart(slug)
  if (!part) return { title: 'Part not found', robots: { index: false } }

  const category = PART_CATEGORIES[part.category]?.en.toLowerCase()
  const description =
    part.metaDescription ||
    `${part.name} (part no. ${part.partNumber})${category ? `, ${category}` : ''} for Ape Ryder, RKS and Skyjet e-bikes. Ask us about availability and compatibility.`
  const cover = [...(part.images ?? []), part.image].find(hasAsset)
  const image = cover ? imageUrl(cover, 1200) : null

  return {
    title: part.metaTitle || part.name,
    description,
    alternates: { canonical: `/parts/${slug}` },
    openGraph: {
      type: 'website',
      title: part.metaTitle || part.name,
      description,
      url: `/parts/${slug}`,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  }
}

export default async function PartPage({ params }: Props) {
  const { slug } = await params
  const part = await getPart(slug)
  if (!part) notFound()

  const compatible = part.compatibleModels.map((model) => model.name)
  const models = compatible.length ? compatible : (await getNavModels()).map((model) => model.name)

  return <PartDetailView part={part} models={models} />
}
