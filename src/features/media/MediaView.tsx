'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { SanityImage, hasImage } from '@/components/sanity/SanityImage'
import { EmptyState } from '@/components/ui/EmptyState'
import { ArrowRight, Download, Send } from '@/components/ui/Icon'
import { PageHero } from '@/components/ui/PageHero'
import { useLanguage, useMessages } from '@/lib/i18n/LanguageContext'
import { mediaMessages } from './messages'
import type { DownloadAsset, Image, PostCard } from '@/lib/sanity/types'
import { formatDate } from '@/lib/utils'
import { PostTile } from '@/features/news/PostTile'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { languageName } from '@/lib/i18n/languageName'

const CONTACT_HREF = '/contact?type=other'

const TYPE_ORDER: DownloadAsset['type'][] = [
  'brochure',
  'specsheet',
  'manual',
  'pricelist',
  'parts-catalogue',
  'presskit',
  'brand-asset',
]

type Props = {
  pressReleases: PostCard[]
  downloads: DownloadAsset[]
  heroImage: Image | null
}

export function MediaView({ pressReleases, downloads, heroImage }: Props) {
  const { locale } = useLanguage()
  const m = useMessages(mediaMessages)

  const groups = useMemo(
    () =>
      TYPE_ORDER.map((type) => ({ type, items: downloads.filter((asset) => asset.type === type) })).filter(
        (group) => group.items.length > 0,
      ),
    [downloads],
  )

  const showContactBand = pressReleases.length > 0 && groups.length > 0

  return (
    <div className="min-h-screen bg-black">
      <PageHero eyebrow={m.hero.eyebrow} title={m.hero.title} subtitle={m.hero.subtitle} image={heroImage} />

      <div className="container section-sm space-y-20">
        <section aria-labelledby="press-releases">
          <SectionTitle id="press-releases" eyebrow={m.press.eyebrow} title={m.press.title} />
          {pressReleases.length === 0 ? (
            <EmptyState
              title={m.press.emptyTitle}
              description={m.press.emptyText}
              icon={Send}
              action={{ label: m.contact.action, href: CONTACT_HREF }}
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {pressReleases.map((post) => (
                <PostTile key={post._id} post={post} headingLevel="h3" />
              ))}
            </div>
          )}
        </section>

        <section aria-labelledby="downloads">
          <SectionTitle id="downloads" eyebrow={m.downloads.eyebrow} title={m.downloads.title} />
          {groups.length === 0 ? (
            <EmptyState
              title={m.downloads.emptyTitle}
              description={m.downloads.emptyText}
              icon={Download}
              action={{ label: m.contact.action, href: CONTACT_HREF }}
            />
          ) : (
            <div className="space-y-12">
              {groups.map((group) => (
                <div key={group.type}>
                  <h3 className="mb-4 flex items-baseline justify-between gap-4 border-b border-dark-3 pb-3">
                    <span className="font-display text-3xl text-off-white leading-none">{m.downloads.types[group.type]}</span>
                    <span className="text-xs uppercase tracking-wider text-mid">{m.downloads.count(group.items.length)}</span>
                  </h3>
                  <ul className="divide-y divide-dark-3 border border-dark-3 bg-dark">
                    {group.items.map((asset) => {
                      const meta = [
                        asset.model?.name,
                        asset.language ? languageName(asset.language, locale) : null,
                        asset.fileSize,
                        asset.publishedDate ? formatDate(asset.publishedDate, locale) : null,
                      ].filter(Boolean)

                      return (
                        <li key={asset._id} className="flex items-center gap-4 p-4 sm:p-5">
                          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden border border-dark-3 bg-dark-2">
                            {hasImage(asset.thumbnail) ? (
                              <SanityImage image={asset.thumbnail} alt="" fill sizes="56px" className="object-cover" />
                            ) : (
                              <Download className="h-5 w-5 text-red" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-off-white break-words">{asset.title}</p>
                            {meta.length > 0 ? (
                              <p className="mt-1 text-xs text-light" suppressHydrationWarning>
                                {meta.join(' · ')}
                              </p>
                            ) : null}
                          </div>
                          <a
                            href={`${asset.fileUrl}?dl=`}
                            aria-label={m.downloads.downloadLabel(asset.title)}
                            className="btn-secondary h-10 shrink-0 justify-center px-3 py-0 text-xs sm:px-4"
                          >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">{m.downloads.download}</span>
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>

        {showContactBand ? (
          <section aria-labelledby="media-contact" className="border-l-4 border-red bg-dark p-8 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red mb-3">{m.contact.eyebrow}</p>
            <h2 id="media-contact" className="font-display text-4xl text-off-white leading-none mb-3">
              {m.contact.title}
            </h2>
            <p className="text-light text-sm max-w-xl mb-6 leading-relaxed">{m.contact.text}</p>
            <Link href={CONTACT_HREF} className="btn-primary">
              {m.contact.action} <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        ) : null}
      </div>
    </div>
  )
}
