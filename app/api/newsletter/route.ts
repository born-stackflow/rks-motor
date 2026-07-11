import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { resend, FROM, getNotificationSettings } from '@/lib/sanity.server'

const schema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = schema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const { email } = result.data

    // Notify the team of the new subscriber
    const notif = await getNotificationSettings()
    await resend.emails.send({
      from: FROM,
      to: notif.team,
      subject: `📧 New Newsletter Signup — ${email}`,
      html: `<p>New newsletter subscriber: <strong>${email}</strong></p><p>Submitted: ${new Date().toLocaleString('en-IE')}</p>`,
    })

    // TODO: Connect to Mailchimp/Resend audience when credentials are provided:
    // await resend.contacts.create({ email, audienceId: process.env.RESEND_AUDIENCE_ID! })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[newsletter]', err)
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }
}
