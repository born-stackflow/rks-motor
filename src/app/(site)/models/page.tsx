import type { Metadata } from 'next'
import { sanityFetchSafe } from '@/lib/sanity/fetch'
import { getSiteSettings } from '@/lib/sanity/data'
import { allModelsQuery } from '@/lib/sanity/queries'
import type { ModelCard } from '@/lib/sanity/types'
import { ModelsView } from '@/features/models/ModelsView'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'E-bike models',
  description: 'The full Ape Ryder, RKS and Skyjet e-bike range: filter by brand and price, compare models side by side.',
  alternates: { canonical: '/models' },
}

export default async function ModelsPage() {
  const [models, settings] = await Promise.all([
    sanityFetchSafe<ModelCard[]>(allModelsQuery, {}, []),
    getSiteSettings(),
  ])

  return <ModelsView models={models} heroImage={settings?.pageBackgrounds?.models ?? null} />
}
