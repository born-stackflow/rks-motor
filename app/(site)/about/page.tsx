import type { Metadata } from 'next'
import { sanityFetchSafe } from '@/lib/sanity/fetch'
import { getSiteSettings } from '@/lib/sanity/data'
import { allModelsQuery, milestonesQuery, teamQuery } from '@/lib/sanity/queries'
import type { Image, Milestone, ModelCard, TeamMember } from '@/lib/sanity/types'
import { BRAND_ORDER } from '@/lib/site'
import { AboutView, type BrandSummary } from './_components/AboutView'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'About us',
  description: 'RKS offers Ape Ryder, RKS and Skyjet e-bikes, genuine spare parts and a programme for trade partners.',
  alternates: { canonical: '/about' },
}

function withAsset(image: Image | undefined) {
  return !!image && typeof image === 'object' && 'asset' in image && !!image.asset
}

export default async function AboutPage() {
  const [settings, models, milestones, team] = await Promise.all([
    getSiteSettings(),
    sanityFetchSafe<ModelCard[]>(allModelsQuery, {}, []),
    sanityFetchSafe<Milestone[]>(milestonesQuery, {}, []),
    sanityFetchSafe<TeamMember[]>(teamQuery, {}, []),
  ])

  const brands: BrandSummary[] = BRAND_ORDER.map((brand) => {
    const ofBrand = models.filter((model) => model.brand === brand)
    const cover = ofBrand.find((model) => withAsset(model.image))
    return { brand, count: ofBrand.length, image: cover?.image ?? null, imageAlt: cover?.name ?? '' }
  })

  return (
    <AboutView
      heroImage={settings?.pageBackgrounds?.about ?? null}
      brands={brands}
      milestones={milestones}
      team={team}
    />
  )
}
