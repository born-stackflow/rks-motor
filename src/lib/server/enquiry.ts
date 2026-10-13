import 'server-only'
import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { getWriteClient } from './sanity-write'
import { sendMail } from './mail'
import { getNotificationSettings, studioDocumentUrl, type NotificationSettings, type Recipient } from './notifications'
import { clientIp, isSameSiteRequest, rateLimit } from './security'
import type { Locale } from '@/lib/site'

const MAX_BODY_BYTES = 20_000

export const text = (max: number) => z.string().trim().min(1).max(max)
export const optionalText = (max: number) => z.string().trim().max(max).optional()
export const email = () => z.string().trim().toLowerCase().email().max(200)

/** Fields every public form sends besides its own data. */
export const formEnvelope = {
  gdprConsent: z.literal(true),
  locale: z.enum(['en', 'it']).default('en'),
  /** Honeypot: hidden from people, filled in by bots. */
  company_fax: z.string().optional(),
}

export type EnquiryContext = {
  id: string
  type: string
  locale: Locale
  settings: NotificationSettings
  studioUrl: string
}

type Mail = { subject: string; html: string; replyTo?: string }

type EnquiryConfig<S extends z.ZodObject> = {
  name: string
  type: string
  schema: S
  recipient: Recipient
  toDocument: (data: z.infer<S>) => Record<string, unknown>
  customerEmail: (data: z.infer<S>) => string
  confirmation: (data: z.infer<S>, ctx: EnquiryContext) => Mail
  notification: (data: z.infer<S>, ctx: EnquiryContext) => Mail
}

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status })
}

export function createEnquiryHandler<S extends z.ZodObject>(config: EnquiryConfig<S>) {
  return async function POST(request: NextRequest) {
    if (!isSameSiteRequest(request)) return json({ error: 'Forbidden' }, 403)

    if (!rateLimit(`${config.name}:${clientIp(request)}`, 5, 10 * 60_000)) {
      return json({ error: 'Too many requests' }, 429)
    }

    const raw = await request.text()
    if (raw.length > MAX_BODY_BYTES) return json({ error: 'Payload too large' }, 413)

    let body: unknown
    try {
      body = JSON.parse(raw)
    } catch {
      return json({ error: 'Invalid JSON' }, 400)
    }

    const parsed = config.schema.safeParse(body)
    if (!parsed.success) {
      const fields = [...new Set(parsed.error.issues.map((issue) => issue.path.join('.')))]
      return json({ error: 'Invalid form data', fields }, 400)
    }
    const data = parsed.data as z.infer<S> & { locale: Locale; company_fax?: string }

    if (data.company_fax) return json({ success: true })

    let id: string
    try {
      const doc = await getWriteClient().create({
        _type: config.type,
        ...config.toDocument(data),
        status: 'new',
        gdprConsent: true,
        submittedAt: new Date().toISOString(),
      })
      id = doc._id
    } catch (err) {
      console.error(`[${config.name}] could not store enquiry`, err)
      return json({ error: 'Submission failed' }, 500)
    }

    // The enquiry is stored from here on: mail problems are logged but never turn into a client error,
    // otherwise people resubmit and create duplicates.
    const settings = await getNotificationSettings()
    const ctx: EnquiryContext = {
      id,
      type: config.type,
      locale: data.locale,
      settings,
      studioUrl: studioDocumentUrl(config.type, id),
    }

    const confirmation = config.confirmation(data, ctx)
    const notification = config.notification(data, ctx)
    const teamAddress = settings.recipients[config.recipient]

    await Promise.all([
      sendMail({ to: config.customerEmail(data), ...confirmation }),
      teamAddress
        ? sendMail({ to: teamAddress, ...notification })
        : Promise.resolve(console.error(`[${config.name}] no "${config.recipient}" recipient configured`)),
    ])

    return json({ success: true, id })
  }
}
