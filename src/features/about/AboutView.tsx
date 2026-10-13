'use client'

import Link from 'next/link'
import { SanityImage, hasImage } from '@/components/sanity/SanityImage'
import { ArrowRight, Building2, Gauge, Wrench, Zap } from '@/components/ui/Icon'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { PageHero } from '@/components/ui/PageHero'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { useMessages } from '@/lib/i18n/LanguageContext'
import { aboutMessages } from './messages'
import { BRANDS } from '@/lib/site'
import type { Brand, Image, Milestone, TeamMember } from '@/lib/sanity/types'
import { cn } from '@/lib/utils'
import { SectionTitle } from '@/components/ui/SectionTitle'

export type BrandSummary = {
  brand: Brand
  count: number
  image: Image | null
  imageAlt: string
}

type Props = {
  heroImage: Image | null
  brands: BrandSummary[]
  milestones: Milestone[]
  team: TeamMember[]
}

const OFFER_ICONS = [Zap, Wrench, Building2]

export function AboutView({ heroImage, brands, milestones, team }: Props) {
  const m = useMessages(aboutMessages)
  const departments: Record<string, string> = m.team.departments

  return (
    <div className="min-h-screen bg-black">
      <PageHero eyebrow={m.hero.eyebrow} title={m.hero.title} subtitle={m.hero.subtitle} image={heroImage} size="lg" />

      <section aria-labelledby="about-intro" className="section-sm">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <SectionTitle id="about-intro" eyebrow={m.intro.eyebrow} title={m.intro.title} className="mb-0" />
          <div className="space-y-5">
            {m.intro.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-light text-base md:text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="about-brands" className="section-sm border-t border-dark-3 bg-dark">
        <div className="container">
          <SectionTitle id="about-brands" eyebrow={m.brands.eyebrow} title={m.brands.title} />
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {brands.map(({ brand, count, image, imageAlt }) => (
              <li key={brand}>
                <Link href={`/models?brand=${brand}`} className="group card flex h-full flex-col overflow-hidden">
                  <div className="product-shot relative aspect-[4/3] overflow-hidden">
                    {hasImage(image) ? (
                      <SanityImage
                        image={image}
                        alt={imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="product-shot-img object-contain p-6"
                      />
                    ) : (
                      <ImagePlaceholder icon={Gauge} />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-4xl text-off-white leading-none transition-colors group-hover:text-red">
                      {BRANDS[brand]}
                    </h3>
                    <p className="mt-2 text-sm uppercase tracking-wider text-light">
                      {count > 0 ? m.brands.models(count) : m.brands.comingSoon}
                    </p>
                    <span className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-red transition-all group-hover:gap-3">
                      {m.brands.explore(BRANDS[brand])} <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="about-offer" className="section-sm border-t border-dark-3">
        <div className="container">
          <SectionTitle id="about-offer" eyebrow={m.offer.eyebrow} title={m.offer.title} />
          <ul className="grid grid-cols-1 gap-px border border-dark-3 bg-dark-3 md:grid-cols-3">
            {m.offer.items.map((item, index) => {
              const IconCmp = OFFER_ICONS[index] ?? Zap
              return (
                <li key={item.href} className="flex flex-col bg-black p-8">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center border border-red/30 bg-red/10">
                    <IconCmp className="h-6 w-6 text-red" />
                  </div>
                  <h3 className="font-display text-3xl text-off-white leading-none mb-3">{item.title}</h3>
                  <p className="text-light text-sm leading-relaxed flex-1">{item.text}</p>
                  <Link
                    href={item.href}
                    className="mt-6 inline-flex min-h-10 items-center gap-1.5 self-start text-sm font-semibold text-red transition-all hover:gap-3"
                  >
                    {item.action} <ArrowRight className="h-4 w-4" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {milestones.length > 0 ? (
        <section aria-labelledby="about-milestones" className="section-sm border-t border-dark-3 bg-dark">
          <div className="container">
            <SectionTitle id="about-milestones" eyebrow={m.milestones.eyebrow} title={m.milestones.title} />
            <ol className="relative max-w-3xl border-l border-dark-3 pl-8">
              {milestones.map((milestone) => (
                <li key={milestone._id} className="relative pb-10 last:pb-0">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute -left-[37px] top-1.5 h-[9px] w-[9px]',
                      milestone.isHighlight ? 'bg-gold' : 'bg-red',
                    )}
                  />
                  <p className={cn('font-display text-3xl leading-none', milestone.isHighlight ? 'text-gold' : 'text-red')}>
                    {milestone.year}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-off-white">{milestone.title}</h3>
                  {milestone.description ? (
                    <p className="mt-2 text-light text-sm leading-relaxed">{milestone.description}</p>
                  ) : null}
                  {hasImage(milestone.image) ? (
                    <div className="relative mt-4 aspect-[16/9] max-w-md overflow-hidden bg-dark-2">
                      <SanityImage
                        image={milestone.image}
                        alt={milestone.image.alt || ''}
                        fill
                        sizes="(max-width: 768px) 100vw, 448px"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {team.length > 0 ? (
        <section aria-labelledby="about-team" className="section-sm border-t border-dark-3">
          <div className="container">
            <SectionTitle id="about-team" eyebrow={m.team.eyebrow} title={m.team.title} />
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member) => (
                <li key={member._id} className="card flex flex-col overflow-hidden hover:border-dark-3">
                  <div className="relative aspect-square overflow-hidden bg-dark-2">
                    {hasImage(member.photo) ? (
                      <SanityImage
                        image={member.photo}
                        alt={member.photo.alt || member.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                    ) : (
                      <ImagePlaceholder />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-semibold text-off-white">{member.name}</h3>
                    <p className="mt-1 text-xs uppercase tracking-wider text-red">{member.role}</p>
                    {member.department && departments[member.department] ? (
                      <p className="mt-1 text-xs text-mid">{departments[member.department]}</p>
                    ) : null}
                    {member.bio ? <p className="mt-3 flex-1 text-sm leading-relaxed text-light">{member.bio}</p> : null}
                    {member.linkedin && /^https?:\/\//.test(member.linkedin) ? (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={m.team.linkedin(member.name)}
                        className="mt-4 flex h-10 w-10 items-center justify-center border border-dark-3 text-light transition-colors hover:border-red hover:text-off-white"
                      >
                        <SocialIcon network="linkedin" />
                      </a>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="about-cta" className="border-t border-dark-3 bg-dark">
        <div className="container section-sm flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="about-cta" className="font-display text-5xl text-off-white leading-none">
              {m.cta.title}
            </h2>
            <p className="mt-3 max-w-xl text-light leading-relaxed">{m.cta.text}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="btn-primary justify-center">
              {m.cta.contact} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/trade" className="btn-secondary justify-center">
              {m.cta.partner}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
