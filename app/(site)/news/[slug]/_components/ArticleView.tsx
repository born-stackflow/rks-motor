'use client'

import Link from 'next/link'
import { RichText } from '@/components/sanity/RichText'
import { SanityImage, hasImage } from '@/components/sanity/SanityImage'
import { Badge } from '@/components/ui/Badge'
import { ArrowLeft, Calendar, Clock, Tag } from '@/components/ui/Icon'
import { ModelCard } from '@/components/ui/ModelCard'
import { useLanguage, useLocalized, useMessages } from '@/contexts/LanguageContext'
import { newsMessages } from '@/lib/i18n/messages/news'
import { POST_CATEGORIES } from '@/lib/site'
import type { PostDetail } from '@/lib/sanity/types'
import { formatDate } from '@/lib/utils'
import { ShareBar } from './ShareBar'

type Props = {
  post: PostDetail
  url: string
  readingMinutes: number | null
}

function BackLink({ label }: { label: string }) {
  return (
    <Link
      href="/news"
      className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-light transition-colors hover:text-red"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  )
}

export function ArticleView({ post, url, readingMinutes }: Props) {
  const { locale } = useLanguage()
  const l = useLocalized()
  const m = useMessages(newsMessages).article
  const category = POST_CATEGORIES[post.category]
  const author = post.author
  const related = post.relatedModels?.filter(Boolean) ?? []

  return (
    <article className="min-h-screen bg-black">
      <header className="container max-w-4xl pt-10 md:pt-14 animate-fade-up">
        <BackLink label={m.back} />
        <div className="mt-8 mb-5 flex flex-wrap items-center gap-2">
          {category ? <Badge variant="red">{l(category)}</Badge> : null}
        </div>
        <h1 className="font-display text-off-white leading-none text-[clamp(2.5rem,6vw,4.75rem)] tracking-[0.01em]">
          {post.title}
        </h1>
        <div className="mt-5 h-[3px] w-[60px] bg-red" />
        <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-light">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-red" />
            <span className="sr-only">{m.published} </span>
            <time dateTime={post.publishedDate} suppressHydrationWarning>
              {formatDate(post.publishedDate, locale)}
            </time>
          </span>
          {readingMinutes ? (
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-red" />
              {m.readingTime(readingMinutes)}
            </span>
          ) : null}
        </p>
        {post.excerpt ? <p className="mt-6 text-lg leading-relaxed text-off-white/90">{post.excerpt.trim()}</p> : null}
      </header>

      {hasImage(post.image) ? (
        <figure className="container max-w-5xl mt-10">
          <div className="relative aspect-[16/9] overflow-hidden bg-dark-2">
            <SanityImage
              image={post.image}
              alt={post.image.alt || ''}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
          {post.image.caption ? <figcaption className="mt-2 text-sm text-mid">{post.image.caption}</figcaption> : null}
        </figure>
      ) : null}

      <div className="container max-w-3xl py-12 md:py-16">
        <RichText value={post.body} />

        {post.tags?.length ? (
          <div className="mt-10 flex flex-wrap items-center gap-2">
            <Tag className="h-4 w-4 text-mid" />
            <span className="sr-only">{m.tags}:</span>
            {post.tags.map((tag) => (
              <span key={tag} className="bg-dark-3 px-3 py-1 text-xs uppercase tracking-wider text-light">
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        {author?.name ? (
          <aside className="mt-12 flex gap-5 border-l-4 border-red bg-dark p-6">
            {hasImage(author.photo) ? (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-dark-2">
                <SanityImage image={author.photo} alt={author.name} fill sizes="64px" className="object-cover" />
              </div>
            ) : null}
            <div className="min-w-0">
              <p className="font-semibold text-off-white">{author.name}</p>
              {author.role ? <p className="text-xs uppercase tracking-wider text-red mt-1">{author.role}</p> : null}
              {author.bio ? <p className="mt-3 text-sm leading-relaxed text-light">{author.bio}</p> : null}
            </div>
          </aside>
        ) : null}

        <div className="mt-10 border-t border-dark-3 pt-8">
          <ShareBar url={url} title={post.title} />
        </div>
      </div>

      {related.length > 0 ? (
        <section aria-labelledby="related-models" className="border-t border-dark-3 bg-dark">
          <div className="container section-sm">
            <h2 id="related-models" className="font-display text-4xl md:text-5xl text-off-white leading-none mb-10">
              {m.relatedModels}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((model, index) => (
                <ModelCard key={model._id} model={model} index={index} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <div className="container max-w-4xl py-10">
        <BackLink label={m.back} />
      </div>
    </article>
  )
}
