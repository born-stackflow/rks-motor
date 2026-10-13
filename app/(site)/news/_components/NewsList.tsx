'use client'

import { useMemo, useState } from 'react'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHero } from '@/components/ui/PageHero'
import { Calendar } from '@/components/ui/Icon'
import { useLocalized, useMessages } from '@/contexts/LanguageContext'
import { newsMessages } from '@/lib/i18n/messages/news'
import { POST_CATEGORIES } from '@/lib/site'
import type { Image, PostCard, PostCategory } from '@/lib/sanity/types'
import { cn } from '@/lib/utils'
import { PostTile } from './PostTile'

type Filter = PostCategory | 'all'

const CATEGORY_ORDER = Object.keys(POST_CATEGORIES) as PostCategory[]

export function NewsList({ posts, heroImage }: { posts: PostCard[]; heroImage: Image | null }) {
  const m = useMessages(newsMessages)
  const l = useLocalized()
  const [filter, setFilter] = useState<Filter>('all')

  const categories = useMemo(() => {
    const present = new Set(posts.map((post) => post.category))
    return CATEGORY_ORDER.filter((category) => present.has(category))
  }, [posts])

  const featured = filter === 'all' ? posts.find((post) => post.isFeatured) : undefined
  const visible = useMemo(
    () => posts.filter((post) => post !== featured && (filter === 'all' || post.category === filter)),
    [posts, featured, filter],
  )

  const options: Array<{ value: Filter; label: string }> = [
    { value: 'all', label: m.filter.all },
    ...categories.map((category) => ({ value: category, label: l(POST_CATEGORIES[category]) })),
  ]

  return (
    <div className="min-h-screen bg-black">
      <PageHero eyebrow={m.hero.eyebrow} title={m.hero.title} subtitle={m.hero.subtitle} image={heroImage} />

      {categories.length > 1 ? (
        <div className="border-b border-dark-3 bg-dark">
          <div className="container py-4">
            <div role="group" aria-label={m.filter.label} className="flex flex-wrap gap-2">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={filter === option.value}
                  onClick={() => setFilter(option.value)}
                  className={cn(
                    'h-10 px-4 text-xs font-semibold uppercase tracking-wider transition-colors',
                    filter === option.value
                      ? 'bg-red text-white'
                      : 'border border-dark-3 text-light hover:border-red hover:text-off-white',
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="container section-sm">
        {posts.length === 0 ? (
          <EmptyState title={m.empty.title} description={m.empty.text} icon={Calendar} action={{ label: m.empty.action, href: '/models' }} />
        ) : (
          <>
            {featured ? (
              <div className="mb-8">
                <PostTile post={featured} variant="featured" />
              </div>
            ) : null}

            {visible.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((post) => (
                  <PostTile key={post._id} post={post} />
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
