import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sanityWriteClient, resend, FROM, STUDIO_URL, SITE_URL, getNotificationSettings } from '@/lib/sanity.server'
import { generateB2CPartsConfirmationEmail } from '@/lib/email-templates/parts-confirmation'
import { generatePartsNotificationEmail } from '@/lib/email-templates/team-notifications'

const schema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  partName: z.string().min(1),
  partNumber: z.string().optional(),
  compatibleModel: z.string().optional(),
  bikeYear: z.number().int().optional(),
  quantityRequired: z.number().int().min(1).default(1),
  enquiryType: z.enum(['purchase', 'availability', 'fitment', 'other']),
  message: z.string().optional(),
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
      _type: 'b2cPartsEnquiry',
      fullName: d.fullName,
      email: d.email,
      phone: d.phone,
      partName: d.partName,
      partNumber: d.partNumber ?? '',
      compatibleModel: d.compatibleModel ?? '',
      bikeYear: d.bikeYear ?? null,
      quantityRequired: d.quantityRequired,
      enquiryType: d.enquiryType,
      message: d.message ?? '',
      status: 'new',
      submittedAt: d.submittedAt,
      gdprConsent: d.gdprConsent,
    })

    const notif = await getNotificationSettings()

    // Customer confirmation
    const confirmation = generateB2CPartsConfirmationEmail({
      customerName: d.fullName,
      partName: d.partName,
      partNumber: d.partNumber,
      compatibleModel: d.compatibleModel,
      quantityRequired: d.quantityRequired,
      enquiryType: d.enquiryType,
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

    // Parts team notification
    const notification = generatePartsNotificationEmail({
      customerName: d.fullName,
      email: d.email,
      phone: d.phone,
      partName: d.partName,
      partNumber: d.partNumber,
      compatibleModel: d.compatibleModel,
      bikeYear: d.bikeYear,
      quantityRequired: d.quantityRequired,
      enquiryType: d.enquiryType,
      message: d.message,
      submittedAt: d.submittedAt,
      isB2B: false,
      cmsUrl: `${STUDIO_URL}/structure/enquiries%3Bb2cPartsEnquiry%3B${doc._id}`,
    })
    await resend.emails.send({
      from: FROM,
      to: notif.parts,
      subject: notification.subject,
      html: notification.html,
    })

    return NextResponse.json({ success: true, id: doc._id })
  } catch (err) {
    console.error('[enquiry-b2c-parts]', err)
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }
}
