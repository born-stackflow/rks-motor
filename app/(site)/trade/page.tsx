import type { Metadata } from 'next'
import { sanityFetchSafe } from '@/lib/sanity/fetch'
import { tradeFaqsQuery } from '@/lib/sanity/queries'
import { getSiteSettings } from '@/lib/sanity/data'
import type { TradeFaq } from '@/lib/sanity/types'
import { TradeView } from './_components/TradeView'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Trade partners',
  description:
    'The RKS partner programme for dealers, distributors, wholesalers and fleets: Ape Ryder, RKS and Skyjet e-bikes and spare parts.',
}

export default async function TradePage() {
  const [settings, faqs] = await Promise.all([
    getSiteSettings(),
    sanityFetchSafe<TradeFaq[]>(tradeFaqsQuery, {}, []),
  ])

  return (
    <div className="min-h-screen bg-black">
      <TradeView image={settings?.b2bSectionBg} faqs={faqs.filter((faq) => faq.question && faq.answer?.length)} />
    </div>
  )
}
