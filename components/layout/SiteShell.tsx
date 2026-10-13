import type { ReactNode } from 'react'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { getNavModels, getSiteSettings } from '@/lib/sanity/data'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { AnnouncementBanner } from './AnnouncementBanner'
import Header from './Header'
import Footer from './Footer'

export async function SiteShell({ children }: { children: ReactNode }) {
  const [settings, models] = await Promise.all([getSiteSettings(), getNavModels()])
  const banner = settings?.announcementBanner?.trim()

  return (
    <LanguageProvider>
      <ScrollProgress />
      {banner ? <AnnouncementBanner text={banner} /> : null}
      <Header models={models} socialLinks={settings?.socialLinks} />
      <main id="main" className="flex-grow">
        {children}
      </main>
      <Footer settings={settings} />
    </LanguageProvider>
  )
}
