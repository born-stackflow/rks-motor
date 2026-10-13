'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { SanityImage, hasImage } from '@/components/sanity/SanityImage'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ArrowRight, Calendar, Search } from '@/components/ui/Icon'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { ModelCard } from '@/components/ui/ModelCard'
import { PartCard } from '@/components/ui/PartCard'
import { useLanguage, useMessages } from '@/lib/i18n/LanguageContext'
import { searchMessages } from './messages'
import { POST_CATEGORIES } from '@/lib/site'
import type { PostCard, SearchResults } from '@/lib/sanity/types'
import { formatDate } from '@/lib/utils'
import { SearchForm } from './SearchForm'

type Props = {
  query: string
  /** Null when no search ran (empty or too short query). */
  results: SearchResults | null
  minLength: number
}

export function SearchView({ query, results, minLength }: Props) {
  const { t } = useLanguage()
  const m = useMessages(searchMessages)
  const total = results ? results.models.length + results.parts.length + results.posts.length : 0

  const browseLinks = (
    <ul className="mt-6 flex flex-wrap justify-center gap-3">
      {[
        { href: '/models', label: t.nav.models },
        { href: '/parts', label: t.nav.parts },
        { href: '/news', label: t.nav.news },
      ].map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="btn-secondary">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )

  return (
    <>
      <div className="border-b border-dark-3 bg-dark-2">
        <div className="container py-10 md:py-14 animate-fade-up">
          <p className="text-red text-xs font-semibold uppercase tracking-[0.3em] mb-3">{m.eyebrow}</p>
          <h1 className="font-display text-off-white leading-none mb-6 text-[clamp(2.75rem,6vw,5rem)] tracking-[0.02em] break-words">
            {query ? m.resultsTitle(query) : m.title}
          </h1>
          <div className="max-w-3xl">
            <SearchForm key={query} initialQuery={query} />
          </div>
        </div>
      </div>

      <div className="section-sm bg-black">
        <div className="container">
          {!query ? (
            <>
              <EmptyState icon={Search} title={m.introTitle} description={m.introText} />
              {browseLinks}
            </>
          ) : query.length < minLength || !results ? (
            <EmptyState icon={Search} title={m.tooShortTitle} description={m.tooShortText} />
          ) : total === 0 ? (
            <>
              <EmptyState
                icon={Search}
                title={m.noResultsTitle(query)}
                description={m.noResultsText}
                action={{ label: m.contact, href: '/contact' }}
              />
              {browseLinks}
            </>
          ) : (
            <div className="space-y-16">
              <p role="status" className="text-sm uppercase tracking-widest text-light">
                {m.summary(total)}
              </p>

              {results.models.length ? (
                <ResultGroup id="results-models" title={m.models} count={results.models.length}>
                  <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {results.models.map((model, index) => (
                      <li key={model._id}>
                        <ModelCard model={model} index={index} />
                      </li>
                    ))}
                  </ul>
                </ResultGroup>
              ) : null}

              {results.parts.length ? (
                <ResultGroup id="results-parts" title={m.parts} count={results.parts.length}>
                  <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {results.parts.map((part, index) => (
                      <li key={part._id}>
                        <PartCard part={part} index={index} />
                      </li>
                    ))}
                  </ul>
                </ResultGroup>
              ) : null}

              {results.posts.length ? (
                <ResultGroup id="results-news" title={m.news} count={results.posts.length}>
                  <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {results.posts.map((post) => (
                      <li key={post._id}>
                        <PostResult post={post} />
                      </li>
                    ))}
                  </ul>
                </ResultGroup>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function ResultGroup({ id, title, count, children }: { id: string; title: string; count: number; children: ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="mb-6 flex items-baseline gap-3 font-display text-4xl leading-none text-off-white">
        {title}
        <span className="font-mono text-base text-light">{count}</span>
      </h2>
      {children}
    </section>
  )
}

function PostResult({ post }: { post: PostCard }) {
  const { t, locale } = useLanguage()
  const category = POST_CATEGORIES[post.category]

  return (
    <Link href={`/news/${post.slug}`} className="group block h-full">
      <article className="card flex h-full flex-col overflow-hidden">
        <div className="relative aspect-[16/9] overflow-hidden bg-dark-2">
          {hasImage(post.image) ? (
            <SanityImage
              image={post.image}
              alt={post.image.alt || ''}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <ImagePlaceholder />
          )}
          {category ? (
            <div className="absolute bottom-3 left-3">
              <Badge variant="red">{category[locale]}</Badge>
            </div>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-5">
          {post.publishedDate ? (
            <p className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-light">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={post.publishedDate}>{formatDate(post.publishedDate, locale)}</time>
            </p>
          ) : null}
          <h3 className="mb-2 text-lg font-bold leading-tight text-off-white transition-colors group-hover:text-red">
            {post.title}
          </h3>
          {post.excerpt ? <p className="line-clamp-3 text-sm leading-relaxed text-light">{post.excerpt}</p> : null}
          <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-red-light transition-all group-hover:gap-2">
            {t.common.readMore} <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </article>
    </Link>
  )
}
