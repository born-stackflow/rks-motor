import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import type { PortableTextBlock } from '@portabletext/types'
import { urlFor } from '@/lib/sanity/client'
import { sanityFetchSafe } from '@/lib/sanity/fetch'
import { postBySlugQuery, postSlugsQuery } from '@/lib/sanity/queries'
import type { Image, PostDetail } from '@/lib/sanity/types'
import { SITE_URL } from '@/lib/site'
import { ArticleView } from './_components/ArticleView'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

const getPost = cache((slug: string) => sanityFetchSafe<PostDetail | null>(postBySlugQuery, { slug }, null))

function ogImageUrl(image: Image | undefined) {
  if (!image || typeof image !== 'object' || !('asset' in image) || !image.asset) return undefined
  return urlFor(image).width(1200).height(630).fit('crop').url()
}

function countWords(body: PortableTextBlock[] | undefined) {
  let words = 0
  for (const block of body ?? []) {
    if (!Array.isArray(block.children)) continue
    for (const child of block.children) {
      if ('text' in child && typeof child.text === 'string') {
        words += child.text.split(/\s+/).filter(Boolean).length
      }
    }
  }
  return words
}

export async function generateStaticParams() {
  const slugs = await sanityFetchSafe<string[]>(postSlugsQuery, {}, [])
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}

  const title = post.metaTitle || post.title
  const description = (post.metaDescription || post.excerpt || '').trim() || undefined
  const image = ogImageUrl(post.image)
  const path = `/news/${post.slug}`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      url: `${SITE_URL}${path}`,
      title,
      description,
      publishedTime: post.publishedDate,
      authors: post.author?.name ? [post.author.name] : undefined,
      tags: post.tags,
      images: image ? [{ url: image, width: 1200, height: 630, alt: post.image?.alt || post.title }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : undefined },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const url = `${SITE_URL}/news/${post.slug}`
  const words = countWords(post.body)
  const image = ogImageUrl(post.image)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: (post.metaDescription || post.excerpt || '').trim() || undefined,
    image: image ? [image] : undefined,
    datePublished: post.publishedDate,
    author: post.author?.name ? { '@type': 'Person', name: post.author.name } : undefined,
    publisher: { '@type': 'Organization', name: 'RKS E-Bikes', url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: post.tags?.length ? post.tags.join(', ') : undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <ArticleView post={post} url={url} readingMinutes={words > 0 ? Math.max(1, Math.round(words / 200)) : null} />
    </>
  )
}
