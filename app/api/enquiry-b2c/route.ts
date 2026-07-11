import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sanityWriteClient, resend, FROM, STUDIO_URL, SITE_URL, getNotificationSettings } from '@/lib/sanity.server'
import { generateB2CConfirmationEmail } from '@/lib/email-templates/b2c-confirmation'
import { generateB2CNotificationEmail } from '@/lib/email-templates/team-notifications'

const schema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  modelInterested: z.string().optional(),
  enquiryType: z.enum(['general', 'test-ride', 'purchase', 'after-sales', 'other']),
  preferredDealer: z.string().optional(),
  message: z.string().min(10),
  gdprConsent: z.literal(true),
  submittedAt: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = schema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: result.error.issues },
        { status: 400 }
      )
    }

    const d = result.data

    // Save to Sanity
    const doc = await sanityWriteClient.create({
      _type: 'b2cEnquiry',
      fullName: d.fullName,
      email: d.email,
      phone: d.phone,
      modelInterested: d.modelInterested ?? '',
      enquiryType: d.enquiryType,
      preferredDealer: d.preferredDealer ?? '',
      message: d.message,
      status: 'new',
      submittedAt: d.submittedAt,
      gdprConsent: d.gdprConsent,
    })

    const notif = await getNotificationSettings()

    // Customer confirmation
    const confirmation = generateB2CConfirmationEmail({
      customerName: d.fullName,
      modelInterested: d.modelInterested,
      enquiryType: d.enquiryType,
      message: d.message,
      siteUrl: SITE_URL,
      siteEmail: notif.siteEmail,
      sitePhone: notif.sitePhone,
      siteAddress: notif.siteAddress,
    })
    await resend.emails.send({
      from: FROM,
      to: d.email,
      subject: confirmation.subject,
      html: confirmation.html,
    })

    // Internal notification
    const notification = generateB2CNotificationEmail({
      customerName: d.fullName,
      email: d.email,
      phone: d.phone,
      modelInterested: d.modelInterested,
      enquiryType: d.enquiryType,
      preferredDealer: d.preferredDealer,
      message: d.message,
      submittedAt: d.submittedAt,
      cmsUrl: `${STUDIO_URL}/structure/enquiries%3Bb2cEnquiry%3B${doc._id}`,
    })
    await resend.emails.send({
      from: FROM,
      to: notif.sales,
      subject: notification.subject,
      html: notification.html,
    })

    return NextResponse.json({ success: true, id: doc._id })
  } catch (err) {
    console.error('[enquiry-b2c]', err)
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }
}
