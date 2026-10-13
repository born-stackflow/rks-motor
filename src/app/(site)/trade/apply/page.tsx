import type { Metadata } from 'next'
import { getNavModels, getSiteSettings } from '@/lib/sanity/data'
import { TradeApplyView } from '@/features/trade/apply/TradeApplyView'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Trade application',
  description: 'Apply to become an RKS trade partner: dealers, distributors, wholesalers, importers and fleets.',
}

export default async function TradeApplyPage() {
  const [settings, navModels] = await Promise.all([getSiteSettings(), getNavModels()])
  const models = navModels.map(({ _id, name, slug, brand }) => ({ _id, name, slug, brand }))

  return (
    <div className="min-h-screen bg-black">
      <TradeApplyView image={settings?.b2bSectionBg} email={settings?.email?.trim() || undefined} models={models} />
    </div>
  )
}
