'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { ArrowRight, Calendar } from '@/components/ui/Icon'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { SanityImage, hasImage } from '@/components/sanity/SanityImage'
import { useLanguage, useLocalized, useMessages } from '@/lib/i18n/LanguageContext'
import { newsMessages } from './messages'
import { POST_CATEGORIES } from '@/lib/site'
import type { PostCard } from '@/lib/sanity/types'
import { cn, formatDate } from '@/lib/utils'

type Props = {
  post: PostCard
  variant?: 'default' | 'featured'
  headingLevel?: 'h2' | 'h3'
}

export function PostTile({ post, variant = 'default', headingLevel: Heading = 'h2' }: Props) {
  const { locale } = useLanguage()
  const l = useLocalized()
  const m = useMessages(newsMessages)
  const featured = variant === 'featured'
  const category = POST_CATEGORIES[post.category]

  return (
    <Link
      href={`/news/${post.slug}`}
      className={cn(
        'group card overflow-hidden flex h-full flex-col hover:border-red transition-colors',
        featured && 'lg:flex-row',
      )}
    >
      <div className={cn('relative aspect-[16/9] overflow-hidden bg-dark-2', featured && 'lg:aspect-auto lg:w-3/5 lg:min-h-[380px]')}>
        {hasImage(post.image) ? (
          <SanityImage
            image={post.image}
            alt=""
            fill
            priority={featured}
            sizes={featured ? '(max-width: 1024px) 100vw, 60vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
            className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <ImagePlaceholder />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
          {category ? <Badge variant="red">{l(category)}</Badge> : null}
          {featured ? <Badge variant="gold">{m.featured}</Badge> : null}
        </div>
      </div>

      <div className={cn('flex flex-1 flex-col p-5 md:p-6', featured && 'lg:w-2/5 lg:justify-center lg:p-10')}>
        <p className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-mid">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <time dateTime={post.publishedDate} suppressHydrationWarning>
              {formatDate(post.publishedDate, locale)}
            </time>
          </span>
          {post.author?.name ? <span>{m.by(post.author.name)}</span> : null}
        </p>
        <Heading
          className={cn(
            'text-off-white leading-snug mb-3 group-hover:text-red transition-colors',
            featured ? 'font-display text-4xl md:text-5xl leading-none' : 'font-bold text-lg',
          )}
        >
          {post.title}
        </Heading>
        {post.excerpt ? (
          <p className={cn('text-light text-sm leading-relaxed flex-1', !featured && 'line-clamp-3')}>
            {post.excerpt.trim()}
          </p>
        ) : null}
        <span className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-red transition-all group-hover:gap-3">
          {m.readArticle} <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
