import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getNavModels, getSiteSettings } from '@/lib/sanity/data'
import { sanityFetchSafe } from '@/lib/sanity/fetch'
import { allPartsQuery } from '@/lib/sanity/queries'
import type { PartCard } from '@/lib/sanity/types'
import { PartsCatalogue, PartsCatalogueView } from './_components/PartsCatalogue'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Parts & accessories',
  description:
    'Genuine and compatible parts and accessories for Ape Ryder, RKS and Skyjet e-bikes. Search by part number or ask us for the part you need.',
  alternates: { canonical: '/parts' },
}

export default async function PartsPage() {
  const [parts, settings, models] = await Promise.all([
    sanityFetchSafe<PartCard[]>(allPartsQuery, {}, []),
    getSiteSettings(),
    getNavModels(),
  ])
  const props = {
    parts,
    background: settings?.pageBackgrounds?.parts,
    models: models.map((model) => model.name),
  }

  return (
    <Suspense fallback={<PartsCatalogueView {...props} category={null} />}>
      <PartsCatalogue {...props} />
    </Suspense>
  )
}
