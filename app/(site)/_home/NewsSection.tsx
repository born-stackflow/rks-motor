'use client'

import Link from 'next/link'
import { SanityImage, hasImage } from '@/components/sanity/SanityImage'
import { ArrowRight, Zap } from '@/components/ui/Icon'
import { useLanguage, useMessages } from '@/contexts/LanguageContext'
import { homeMessages } from '@/lib/i18n/messages/home'
import type { PostCard } from '@/lib/sanity/types'
import { POST_CATEGORIES } from '@/lib/site'
import { formatDate } from '@/lib/utils'
import { SectionHeader } from './SectionHeader'

/** Latest blog posts; the section disappears while nothing has been published. */
export function NewsSection({ posts }: { posts: PostCard[] }) {
  const t = useMessages(homeMessages).news
  const { t: common, locale } = useLanguage()
  if (posts.length === 0) return null

  return (
    <section className="section relative overflow-hidden bg-black">
      <div className="container relative">
        <SectionHeader tag={t.tag} title={t.title} link={{ href: '/news', label: t.allNews }} />
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <li key={post._id}>
              <Link href={`/news/${post.slug}`} className="group block h-full">
                <article className="card flex h-full flex-col overflow-hidden transition-colors duration-300 group-hover:border-red/40">
                  <div className="relative aspect-[16/9] overflow-hidden bg-dark-2">
                    {hasImage(post.image) ? (
                      <SanityImage
                        image={post.image}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-dark-2">
                        <Zap className="h-10 w-10 text-dark-3" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className="badge absolute bottom-3 left-3 border border-red/40 bg-black/70 text-red-light">
                      {POST_CATEGORIES[post.category]?.[locale] ?? post.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    {post.publishedDate ? (
                      <time dateTime={post.publishedDate} className="mb-2 text-xs text-light">
                        {formatDate(post.publishedDate, locale)}
                      </time>
                    ) : null}
                    <h3 className="mb-2 font-bold leading-snug text-off-white transition-colors group-hover:text-red">
                      {post.title}
                    </h3>
                    {post.excerpt ? (
                      <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-light">{post.excerpt.trim()}</p>
                    ) : null}
                    <span className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-red transition-all group-hover:gap-3">
                      {common.common.readMore} <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
