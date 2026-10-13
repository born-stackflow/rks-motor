import type { Metadata } from 'next'
import { getNavModels, getSiteSettings } from '@/lib/sanity/data'
import { ContactView } from '@/features/contact/ContactView'
import { parseContactParams } from '@/features/contact/enquiry'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact the RKS team about Ape Ryder, RKS and Skyjet e-bikes, test rides, purchases and spare parts.',
}

const isWebUrl = (value: string | undefined) => (value && /^https?:\/\//i.test(value) ? value : undefined)

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [settings, navModels, params] = await Promise.all([getSiteSettings(), getNavModels(), searchParams])
  const models = navModels.map(({ name, slug }) => ({ name, slug }))

  return (
    <div className="min-h-screen bg-black">
      <ContactView
        image={settings?.pageBackgrounds?.contact}
        details={{
          address: settings?.address?.trim() || undefined,
          phone: settings?.phone?.trim() || undefined,
          email: settings?.email?.trim() || undefined,
          googleMapsUrl: isWebUrl(settings?.googleMapsUrl?.trim()),
        }}
        models={models}
        prefill={parseContactParams(params, models)}
      />
    </div>
  )
}
