import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sanityWriteClient, resend, FROM, STUDIO_URL, SITE_URL, getNotificationSettings } from '@/lib/sanity.server'
import { generateB2BPartsConfirmationEmail } from '@/lib/email-templates/parts-confirmation'
import { generatePartsNotificationEmail } from '@/lib/email-templates/team-notifications'

const schema = z.object({
  businessName: z.string().min(1),
  vatNumber: z.string().min(1),
  contactName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  partName: z.string().min(1),
  partNumber: z.string().optional(),
  compatibleModel: z.string().optional(),
  quantityRequired: z.number().int().min(1),
  isRecurringOrder: z.boolean().default(false),
  monthlyQuantity: z.number().int().optional(),
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
      _type: 'b2bPartsEnquiry',
      businessName: d.businessName,
      vatNumber: d.vatNumber,
      contactName: d.contactName,
      email: d.email,
      phone: d.phone,
      partName: d.partName,
      partNumber: d.partNumber ?? '',
      compatibleModel: d.compatibleModel ?? '',
      quantityRequired: d.quantityRequired,
      isRecurringOrder: d.isRecurringOrder,
      monthlyQuantity: d.monthlyQuantity ?? null,
      message: d.message ?? '',
      status: 'new',
      submittedAt: d.submittedAt,
      gdprConsent: d.gdprConsent,
    })

    const notif = await getNotificationSettings()

    // Business confirmation
    const confirmation = generateB2BPartsConfirmationEmail({
      contactName: d.contactName,
      businessName: d.businessName,
      partName: d.partName,
      partNumber: d.partNumber,
      quantityRequired: d.quantityRequired,
      isRecurringOrder: d.isRecurringOrder,
      monthlyQuantity: d.monthlyQuantity,
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

    // Sales team notification
    const notification = generatePartsNotificationEmail({
      customerName: d.contactName,
      email: d.email,
      phone: d.phone,
      partName: d.partName,
      partNumber: d.partNumber,
      compatibleModel: d.compatibleModel,
      quantityRequired: d.quantityRequired,
      enquiryType: d.isRecurringOrder ? 'recurring-order' : 'one-time-order',
      message: d.message,
      submittedAt: d.submittedAt,
      isB2B: true,
      businessName: d.businessName,
      cmsUrl: `${STUDIO_URL}/structure/enquiries%3Bb2bPartsEnquiry%3B${doc._id}`,
    })
    await resend.emails.send({
      from: FROM,
      to: notif.trade,
      subject: notification.subject,
      html: notification.html,
    })

    return NextResponse.json({ success: true, id: doc._id })
  } catch (err) {
    console.error('[enquiry-b2b-parts]', err)
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }
}
