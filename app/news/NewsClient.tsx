'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { Search, ArrowRight, Clock, Calendar } from '@/components/ui/Icon'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { formatDate } from '@/lib/utils'
import { urlFor } from '@/lib/sanity'
import type { BlogPostCard } from '@/lib/sanity'

const CATEGORY_LABELS: Record<string, string> = {
  news: 'News',
  launches: 'Model Launches',
  events: 'Events',
  press: 'Press',
  technology: 'Technology',
  lifestyle: 'Lifestyle',
}

const catBadge: Record<string, 'red' | 'gold' | 'green' | 'amber' | 'dark'> = {
  news: 'red',
  launches: 'gold',
  events: 'amber',
  press: 'dark',
  technology: 'red',
  lifestyle: 'green',
}

function readTime(post: BlogPostCard): string {
  const words = post.excerpt?.split(' ').length ?? 0
  return `${Math.max(2, Math.ceil(words / 40))} min read`
}

function postImageUrl(post: BlogPostCard): string | undefined {
  if (post.featuredImage && (post.featuredImage as any)?.asset) {
    return urlFor(post.featuredImage).width(900).height(506).quality(85).url()
  }
  return undefined
}

function postSlug(post: BlogPostCard): string {
  return (post.slug as any)?.current ?? ''
}

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' },
  }),
}

export default function NewsClient({ posts }: { posts: BlogPostCard[] }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery,      setSearchQuery]      = useState('')

  const categories = [
    { value: 'all', label: 'All' },
    ...Array.from(new Set(posts.map(p => p.category)))
      .filter(Boolean)
      .map(c => ({ value: c, label: CATEGORY_LABELS[c] ?? c })),
  ]

  const filtered = posts.filter(p => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory
    const q = searchQuery.toLowerCase()
    const matchSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt?.toLowerCase().includes(q) ||
      p.tags?.some(t => t.toLowerCase().includes(q))
    return matchCat && matchSearch
  })

  const featured = filtered.filter(p => p.isFeatured)
  const rest     = filtered.filter(p => !p.isFeatured)

  return (
    <div className="min-h-screen bg-black">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative h-[40vh] min-h-[260px] overflow-hidden">
        <ImagePlaceholder />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <p className="text-red text-xs font-semibold uppercase tracking-[0.3em] mb-3">
              Latest Updates
            </p>
            <h1
              className="text-off-white leading-none mb-2"
              style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(3rem, 7vw, 6rem)',
                letterSpacing: '0.02em',
              }}
            >
              News & Updates
            </h1>
            <div className="h-[3px] w-[60px] bg-red" />
          </div>
        </div>
      </section>

      {/* ── Filter bar ────────────────────────────────────────────── */}
      <div className="border-b border-dark-3 bg-dark sticky top-0 z-10">
        <div className="container py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-1 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-red text-white'
                    : 'text-light hover:text-off-white hover:bg-dark-3'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative sm:ml-auto w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-mid" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input pl-9 text-xs h-9 w-full"
            />
          </div>
        </div>
      </div>

      {/* ── Article grid ──────────────────────────────────────────── */}
      <div className="container py-10">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-14 h-14 bg-red/10 border border-red/20 flex items-center justify-center mb-5">
              <Search className="h-7 w-7 text-red/60" />
            </div>
            <h3
              className="text-3xl text-off-white mb-2"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              No Articles Found
            </h3>
            <p className="text-light text-sm">Try a different search or category filter.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery('') }}
              className="btn-secondary mt-6"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Featured — large 2-col */}
            {featured.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {featured.map((post, i) => (
                  <motion.div
                    key={post._id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    variants={fadeUp}
                  >
                    <Link href={`/news/${postSlug(post)}`} className="group block h-full">
                      <div className="card overflow-hidden h-full flex flex-col hover:border-red transition-colors">
                        <div className="relative aspect-[16/9] overflow-hidden">
                          {postImageUrl(post) ? (
                            <Image
                              src={postImageUrl(post)!}
                              alt={post.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <ImagePlaceholder />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                          <div className="absolute bottom-3 left-3 flex items-center gap-2">
                            <Badge variant={catBadge[post.category] ?? 'dark'}>
                              {CATEGORY_LABELS[post.category] ?? post.category}
                            </Badge>
                            <span className="badge bg-red/20 text-red border border-red/40 text-[10px]">
                              FEATURED
                            </span>
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-center gap-3 text-xs text-mid mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(post.publishedDate)}
                            </span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {readTime(post)}
                            </span>
                            {post.author?.name && (
                              <>
                                <span>·</span>
                                <span>{post.author.name}</span>
                              </>
                            )}
                          </div>
                          <h2 className="text-off-white font-bold text-lg leading-snug mb-2 group-hover:text-red transition-colors">
                            {post.title}
                          </h2>
                          <p className="text-light text-sm leading-relaxed flex-1">{post.excerpt}</p>
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-4">
                              {post.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-[10px] px-2 py-0.5 bg-dark-3 text-mid uppercase tracking-wider">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 mt-4 text-sm font-semibold text-red group-hover:gap-3 transition-all">
                            Read more <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Rest — 3-col grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((post, i) => (
                  <motion.div
                    key={post._id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    variants={fadeUp}
                  >
                    <Link href={`/news/${postSlug(post)}`} className="group block h-full">
                      <div className="card overflow-hidden h-full flex flex-col hover:border-red transition-colors">
                        <div className="relative aspect-[16/9] overflow-hidden">
                          {postImageUrl(post) ? (
                            <Image
                              src={postImageUrl(post)!}
                              alt={post.title}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <ImagePlaceholder />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-3 left-3">
                            <Badge variant={catBadge[post.category] ?? 'dark'}>
                              {CATEGORY_LABELS[post.category] ?? post.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-center gap-3 text-xs text-mid mb-2">
                            <span>{formatDate(post.publishedDate)}</span>
                            <span>·</span>
                            <span>{readTime(post)}</span>
                          </div>
                          <h3 className="text-off-white font-bold text-base leading-snug mb-2 group-hover:text-red transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-light text-sm leading-relaxed flex-1 line-clamp-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-1.5 mt-4 text-sm font-semibold text-red group-hover:gap-3 transition-all">
                            Read more <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
