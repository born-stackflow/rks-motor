import type { ReactNode } from 'react'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'
import { getNavModels, getSiteSettings } from '@/lib/sanity/data'
import { MotionProvider } from './MotionProvider'
import { ServiceWorkerRegister } from './ServiceWorkerRegister'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { AnnouncementBanner } from './AnnouncementBanner'
import Header from './Header'
import Footer from './Footer'

export async function SiteShell({ children }: { children: ReactNode }) {
  const [settings, models] = await Promise.all([getSiteSettings(), getNavModels()])
  const banner = settings?.announcementBanner?.trim()

  return (
    <LanguageProvider>
      <MotionProvider>
      <ScrollProgress />
      <ServiceWorkerRegister />
      {banner ? <AnnouncementBanner text={banner} /> : null}
      <Header models={models} socialLinks={settings?.socialLinks} />
      <main id="main" className="flex-grow">
        {children}
      </main>
      <Footer
        settings={
          settings
            ? { socialLinks: settings.socialLinks, footerText: settings.footerText, phone: settings.phone, email: settings.email, address: settings.address }
            : null
        }
      />
      </MotionProvider>
    </LanguageProvider>
  )
}
