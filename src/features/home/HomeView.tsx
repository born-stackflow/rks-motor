'use client'

import { MotionConfig } from 'framer-motion'
import { HeroSlider, type HeroSlideMedia } from '@/features/home/hero/HeroSlider'
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
import { EicmaPopupLauncher } from './eicma/EicmaPopupLauncher'

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
        <div className="cv-auto"><PartsSection tiles={data.partTiles} background={data.backgrounds.parts} /></div>
        {data.parts.length > 0 ? <div className="cv-auto"><PopularParts parts={data.parts} /></div> : null}
        <div className="cv-auto"><WhySection background={data.backgrounds.why} /></div>
        {data.posts.length > 0 ? <div className="cv-auto"><NewsSection posts={data.posts} /></div> : null}
        <div className="cv-auto"><DealerTeaser background={data.backgrounds.dealer} /></div>
        <div className="cv-auto"><B2BCallout background={data.backgrounds.b2b} /></div>
        <div className="cv-auto"><Newsletter /></div>
        <EicmaPopupLauncher />
      </div>
    </MotionConfig>
  )
}
