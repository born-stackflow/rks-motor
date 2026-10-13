import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { email } from '@/lib/server/enquiry'
import { addToSegment, sendMail } from '@/lib/server/mail'
import { getNotificationSettings } from '@/lib/server/notifications'
import { clientIp, isSameSiteRequest, rateLimit } from '@/lib/server/security'
import { renderEmail } from '@/lib/email/render'

const schema = z.object({
  email: email(),
  locale: z.enum(['en', 'it']).default('en'),
  company_fax: z.string().optional(),
})

export async function POST(request: NextRequest) {
  if (!isSameSiteRequest(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (!rateLimit(`newsletter:${clientIp(request)}`, 3, 10 * 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  if (parsed.data.company_fax) return NextResponse.json({ success: true })

  const subscriber = parsed.data.email
  const segmentId = process.env.RESEND_SEGMENT_ID
  if (segmentId) {
    const ok = await addToSegment(segmentId, subscriber)
    return ok
      ? NextResponse.json({ success: true })
      : NextResponse.json({ error: 'Subscription failed' }, { status: 502 })
  }

  const { recipients } = await getNotificationSettings()
  if (!recipients.team) {
    console.error('[newsletter] no audience and no team recipient configured')
    return NextResponse.json({ error: 'Subscription unavailable' }, { status: 503 })
  }
  const ok = await sendMail({
    to: recipients.team,
    replyTo: subscriber,
    subject: `Nuova iscrizione newsletter — ${subscriber}`,
    html: renderEmail({
      lang: 'it',
      preheader: subscriber,
      eyebrow: 'Newsletter',
      heading: 'Nuovo iscritto alla newsletter',
      paragraphs: [],
      rows: [
        ['Email', subscriber],
        ['Lingua del sito', parsed.data.locale.toUpperCase()],
      ],
      footerNote: 'Imposta RESEND_SEGMENT_ID per salvare gli iscritti direttamente in Resend.',
    }),
  })
  return ok
    ? NextResponse.json({ success: true })
    : NextResponse.json({ error: 'Subscription failed' }, { status: 502 })
}
