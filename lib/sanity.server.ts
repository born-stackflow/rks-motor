import { createClient } from '@sanity/client'
import { Resend } from 'resend'

// Server-only write client — never imported in client components
export const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

export const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM = process.env.RESEND_FROM_EMAIL || 'noreply@rks-motorcycles.com'
export const STUDIO_URL = process.env.SANITY_STUDIO_URL || 'https://rks.sanity.studio'
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rks-motorcycles.com'

type NotificationSiteSettings = {
  email?: string
  salesEmail?: string
  tradeEmail?: string
  partsEmail?: string
  teamNotificationEmail?: string
  phone?: string
  address?: string
}

// Recipient + display-contact resolution for notification/confirmation emails.
// CMS (Sanity siteSettings) is the source of truth; env vars are the fallback
// so nothing breaks if the CMS fields are left empty.
export async function getNotificationSettings() {
  const s = await sanityWriteClient
    .fetch<NotificationSiteSettings | null>(
      `*[_type=="siteSettings"][0]{ email, salesEmail, tradeEmail, partsEmail, teamNotificationEmail, phone, address }`
    )
    .catch(() => null)

  return {
    sales: s?.salesEmail || process.env.SALES_TEAM_EMAIL || process.env.TEAM_NOTIFICATION_EMAIL!,
    trade: s?.tradeEmail || process.env.TRADE_TEAM_EMAIL || process.env.SALES_TEAM_EMAIL!,
    parts: s?.partsEmail || process.env.PARTS_TEAM_EMAIL || process.env.TEAM_NOTIFICATION_EMAIL!,
    team:  s?.teamNotificationEmail || process.env.TEAM_NOTIFICATION_EMAIL!,
    siteEmail:   s?.email || 'info@rks-motorcycles.com',
    sitePhone:   s?.phone || '',
    siteAddress: s?.address || '',
  }
}
