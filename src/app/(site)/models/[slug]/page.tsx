import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { sanityFetchSafe } from '@/lib/sanity/fetch'
import { modelBySlugQuery, modelSlugsQuery } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import type { ModelDetail } from '@/lib/sanity/types'
import { SITE_URL, brandLabel } from '@/lib/site'
import { SCHEMA_AVAILABILITY } from '@/features/models/specs'
import { ModelDetailView } from '@/features/models/detail/ModelDetailView'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

const getModel = cache((slug: string) => sanityFetchSafe<ModelDetail | null>(modelBySlugQuery, { slug }, null))

export async function generateStaticParams() {
  const slugs = await sanityFetchSafe<string[]>(modelSlugsQuery, {}, [])
  return slugs.map((slug) => ({ slug }))
}

function ogImageUrl(model: ModelDetail) {
  const source = model.heroImage ?? model.image
  return source ? urlFor(source).width(1200).height(630).fit('crop').url() : '/api/og'
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const model = await getModel(slug)
  if (!model) return {}

  const title = model.metaTitle || model.name
  const description = model.metaDescription || model.tagline || `${brandLabel(model.brand)} ${model.name} e-bike.`
  const image = ogImageUrl(model)
  const path = `/models/${model.slug}`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: 'RKS E-Bikes',
      url: `${SITE_URL}${path}`,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: model.name }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

function productJsonLd(model: ModelDetail) {
  const url = `${SITE_URL}/models/${model.slug}`
  const images = [model.heroImage, model.image].flatMap((source) =>
    source ? [urlFor(source).width(1200).url()] : [],
  )

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: model.name,
    url,
    brand: { '@type': 'Brand', name: brandLabel(model.brand) },
    ...(images.length ? { image: images } : {}),
    ...(model.tagline ? { description: model.tagline } : {}),
    ...(typeof model.price === 'number'
      ? {
          offers: {
            '@type': 'Offer',
            url,
            price: model.price,
            priceCurrency: 'EUR',
            ...(model.availability ? { availability: SCHEMA_AVAILABILITY[model.availability] } : {}),
          },
        }
      : {}),
  }
}

export default async function ModelPage({ params }: Props) {
  const { slug } = await params
  const model = await getModel(slug)
  if (!model) notFound()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(model)).replace(/</g, '\\u003c') }}
      />
      <ModelDetailView model={model} />
    </>
  )
}
