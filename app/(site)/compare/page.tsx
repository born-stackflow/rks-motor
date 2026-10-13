import type { Metadata } from 'next'
import { sanityClient, queries } from '@/lib/sanity'
import CompareClient, { type CompareModel } from './CompareClient'

export const metadata: Metadata = {
  title: 'Compare Models | RKS E-Bikes',
  description: 'Compare RKS E-Bikes models side by side — motor, battery, range, brakes, and features.',
  openGraph: {
    title: 'RKS E-Bikes — Compare Models',
    description: 'Compare RKS E-Bikes models side by side.',
    type: 'website',
  },
}

export const revalidate = 60

export default async function ComparePage() {
  const models: CompareModel[] = await sanityClient
    .fetch(queries.compareModels)
    .catch(() => [])

  if (models.length < 2) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center py-32 text-center">
        <h1 className="text-3xl text-off-white mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
          Not Enough Models Yet
        </h1>
        <p className="text-light text-sm">Add at least two models in the CMS to enable comparison.</p>
      </div>
    )
  }

  return <CompareClient models={models} />
}
