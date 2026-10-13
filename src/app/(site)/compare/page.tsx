import type { Metadata } from 'next'
import { sanityFetchSafe } from '@/lib/sanity/fetch'
import { compareModelsQuery } from '@/lib/sanity/queries'
import type { CompareModel } from '@/lib/sanity/types'
import CompareClient from '@/features/compare/CompareClient'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Compare models',
  description: 'Compare up to three Ape Ryder, RKS and Skyjet e-bikes side by side: motor, battery, range, brakes and more.',
  alternates: { canonical: '/compare' },
}

export default async function ComparePage() {
  const models = await sanityFetchSafe<CompareModel[]>(compareModelsQuery, {}, [])
  return <CompareClient models={models} />
}
