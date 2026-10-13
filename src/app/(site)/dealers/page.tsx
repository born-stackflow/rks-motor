import type { Metadata } from 'next'
import { sanityFetchSafe } from '@/lib/sanity/fetch'
import { getSiteSettings } from '@/lib/sanity/data'
import { dealersQuery } from '@/lib/sanity/queries'
import type { Dealer } from '@/lib/sanity/types'
import { DealersView } from '@/features/dealers/DealersView'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Dealers',
  description: 'Find RKS partners for Ape Ryder, RKS and Skyjet e-bike sales, servicing and genuine parts.',
  alternates: { canonical: '/dealers' },
}

export default async function DealersPage() {
  const [dealers, settings] = await Promise.all([
    sanityFetchSafe<Dealer[]>(dealersQuery, {}, []),
    getSiteSettings(),
  ])

  return <DealersView dealers={dealers} heroImage={settings?.pageBackgrounds?.dealers ?? null} />
}
