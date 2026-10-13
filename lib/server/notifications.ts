import 'server-only'
import { sanityClient } from '@/lib/sanity/client'
import { SITE_URL } from '@/lib/site'

export type Recipient = 'sales' | 'trade' | 'parts' | 'team'

export type ContactDetails = {
  email?: string
  phone?: string
  address?: string
}

export type NotificationSettings = {
  recipients: Record<Recipient, string | undefined>
  contact: ContactDetails
}

type CmsContact = {
  email?: string
  phone?: string
  address?: string
  salesEmail?: string
  tradeEmail?: string
  partsEmail?: string
  teamNotificationEmail?: string
}

export const STUDIO_URL = (process.env.SANITY_STUDIO_URL || `${SITE_URL}/studio`).replace(/\/$/, '')

export function studioDocumentUrl(type: string, id: string) {
  return `${STUDIO_URL}/intent/edit/id=${encodeURIComponent(id)};type=${encodeURIComponent(type)}`
}

/**
 * Recipients are managed in Studio → Site Settings → Contact and take effect without a redeploy.
 * Environment variables are the fallback when a CMS field is empty or the CMS is unreachable.
 */
export async function getNotificationSettings(): Promise<NotificationSettings> {
  const cms = await sanityClient
    .withConfig({ useCdn: false })
    .fetch<CmsContact | null>(
      `*[_type == "siteSettings"][0]{ email, phone, address, salesEmail, tradeEmail, partsEmail, teamNotificationEmail }`,
    )
    .catch((err) => {
      console.error('[notifications] could not read site settings', err)
      return null
    })

  const env = process.env
  const team = cms?.teamNotificationEmail || env.TEAM_NOTIFICATION_EMAIL
  const sales = cms?.salesEmail || env.SALES_TEAM_EMAIL || team

  return {
    recipients: {
      team,
      sales,
      trade: cms?.tradeEmail || env.TRADE_TEAM_EMAIL || sales,
      parts: cms?.partsEmail || env.PARTS_TEAM_EMAIL || sales,
    },
    contact: {
      email: cms?.email || undefined,
      phone: cms?.phone || undefined,
      address: cms?.address || undefined,
    },
  }
}
