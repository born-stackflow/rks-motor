'use client'

import { MotionConfig } from 'framer-motion'
import { HeroSlider, type HeroSlideMedia } from '@/components/hero/HeroSlider'
import type { Image, ModelCard, PartCard, PostCard } from '@/lib/sanity/types'
import { B2BCallout } from './B2BCallout'
import { DealerTeaser } from './DealerTeaser'
import { FeaturedModels } from './FeaturedModels'
import { Marquee } from './Marquee'
import { NewsSection } from './NewsSection'
import { Newsletter } from './Newsletter'
import { PartsSection, type PartTile } from './PartsSection'
import { PopularParts } from './PopularParts'
import { StatsBar } from './StatsBar'
import { WhySection } from './WhySection'

export type HomeData = {
  heroSlides: HeroSlideMedia[]
  stats: Array<{ value: string; label: string }>
  models: ModelCard[]
  parts: PartCard[]
  partTiles: PartTile[]
  posts: PostCard[]
  backgrounds: { parts?: Image; why?: Image; dealer?: Image; b2b?: Image }
}

export function HomeView({ data }: { data: HomeData }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-black">
        <HeroSlider media={data.heroSlides} />
        <Marquee />
        <StatsBar stats={data.stats} />
        <FeaturedModels models={data.models} />
        <PartsSection tiles={data.partTiles} background={data.backgrounds.parts} />
        <PopularParts parts={data.parts} />
        <WhySection background={data.backgrounds.why} />
        <NewsSection posts={data.posts} />
        <DealerTeaser background={data.backgrounds.dealer} />
        <B2BCallout background={data.backgrounds.b2b} />
        <Newsletter />
      </div>
    </MotionConfig>
  )
}
