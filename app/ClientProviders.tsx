'use client'

import { LanguageProvider } from '@/contexts/LanguageContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ScrollProgress } from '@/components/ui/ScrollProgress'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ScrollProgress />
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </LanguageProvider>
  )
}
