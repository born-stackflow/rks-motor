import type { Metadata } from 'next'
import { sanityFetchSafe } from '@/lib/sanity/fetch'
import { getSiteSettings } from '@/lib/sanity/data'
import { allModelsQuery } from '@/lib/sanity/queries'
import type { ModelCard } from '@/lib/sanity/types'
import { PricesView } from './PricesView'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Prices',
  description: 'Indicative prices for the Ape Ryder, RKS and Skyjet e-bike range, grouped by brand.',
  alternates: { canonical: '/prices' },
}

export default async function PricesPage() {
  const [models, settings] = await Promise.all([
    sanityFetchSafe<ModelCard[]>(allModelsQuery, {}, []),
    getSiteSettings(),
  ])

  return <PricesView models={models} heroImage={settings?.pageBackgrounds?.models ?? null} />
}
