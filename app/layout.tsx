import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, Inter } from 'next/font/google'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import { getSiteSettings } from '@/lib/sanity/data'
import { urlFor } from '@/lib/sanity/client'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })
const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-bebas' })

const DEFAULT_TITLE = 'RKS | Premium E-Bikes & Parts'
const DEFAULT_DESCRIPTION =
  'Ape Ryder, RKS and Skyjet e-bikes, genuine parts and a dealer network. Discover the range, compare models and request a quote.'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const title = settings?.metaTitle || DEFAULT_TITLE
  const description = settings?.metaDescription || DEFAULT_DESCRIPTION
  const ogImage = settings?.ogImage ? urlFor(settings.ogImage).width(1200).height(630).fit('crop').url() : '/api/og'

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | ${SITE_NAME}` },
    description,
    applicationName: 'RKS E-Bikes',
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      siteName: 'RKS E-Bikes',
      url: SITE_URL,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
    verification: settings?.googleVerification ? { google: settings.googleVerification } : undefined,
  }
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-black text-off-white font-body" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
