import type { Metadata } from 'next'
import { Bebas_Neue, Inter } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'
import { ClientProviders } from './ClientProviders'

const inter = Inter({
  variable: '--loaded-inter',
  subsets: ['latin'],
  display: 'swap',
})

const bebasNeue = Bebas_Neue({
  variable: '--loaded-bebas',
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RKS | Premium E-Bikes & Parts',
  description:
    'Born on the track. Built for the road. Discover RKS — premium Italian e-bikes, genuine OEM parts, and a global dealer network.',
  keywords: 'e-bikes, RKS, Italian e-bikes, premium electric bikes, OEM parts, sport, adventure, cruiser',
  authors: [{ name: 'Tech Logies' }],
  creator: 'Tech Logies',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rks.com',
    title: 'RKS | Premium E-Bikes & Parts',
    description: 'Born on the track. Built for the road.',
    siteName: 'RKS E-Bikes',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RKS | Premium E-Bikes & Parts',
    description: 'Born on the track. Built for the road.',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''
  const isStudio = pathname.startsWith('/studio')

  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable} h-full`}
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <body className="min-h-full flex flex-col bg-black text-off-white" suppressHydrationWarning>
        {isStudio ? (
          children
        ) : (
          <ClientProviders>{children}</ClientProviders>
        )}
      </body>
    </html>
  )
}
