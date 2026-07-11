import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sanityWriteClient, resend, FROM, STUDIO_URL, SITE_URL, getNotificationSettings } from '@/lib/sanity.server'
import { generateB2BConfirmationEmail } from '@/lib/email-templates/b2b-confirmation'
import { generateB2BNotificationEmail } from '@/lib/email-templates/team-notifications'

const schema = z.object({
  businessName: z.string().min(1),
  businessType: z.enum(['dealer', 'distributor', 'wholesaler', 'fleet', 'importer', 'other']),
  vatNumber: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  contactName: z.string().min(1),
  jobTitle: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  whatsapp: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  modelsOfInterest: z.array(z.string()),
  estimatedQuantity: z.enum(['1-5', '6-15', '16-30', '30+']).optional(),
  hasShowroom: z.boolean().optional(),
  referralSource: z.enum(['google', 'trade-show', 'referral', 'social-media', 'other']).optional(),
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
      _type: 'b2bEnquiry',
      businessName: d.businessName,
      businessType: d.businessType,
      vatNumber: d.vatNumber,
      address: d.address,
      city: d.city,
      country: d.country,
      contactName: d.contactName,
      jobTitle: d.jobTitle,
      email: d.email,
      phone: d.phone,
      whatsapp: d.whatsapp ?? '',
      website: d.website ?? '',
      modelsOfInterest: d.modelsOfInterest,
      estimatedQuantity: d.estimatedQuantity ?? '',
      hasShowroom: d.hasShowroom ?? false,
      referralSource: d.referralSource ?? '',
      message: d.message ?? '',
      status: 'new',
      submittedAt: d.submittedAt,
      gdprConsent: d.gdprConsent,
    })

    const notif = await getNotificationSettings()

    // Applicant confirmation
    const confirmation = generateB2BConfirmationEmail({
      contactName: d.contactName,
      businessName: d.businessName,
      businessType: d.businessType,
      city: d.city,
      country: d.country,
      modelsOfInterest: d.modelsOfInterest,
      estimatedQuantity: d.estimatedQuantity,
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
    const notification = generateB2BNotificationEmail({
      businessName: d.businessName,
      businessType: d.businessType,
      vatNumber: d.vatNumber,
      contactName: d.contactName,
      jobTitle: d.jobTitle,
      email: d.email,
      phone: d.phone,
      address: d.address,
      city: d.city,
      country: d.country,
      website: d.website,
      modelsOfInterest: d.modelsOfInterest,
      estimatedQuantity: d.estimatedQuantity,
      hasShowroom: d.hasShowroom,
      referralSource: d.referralSource,
      message: d.message,
      submittedAt: d.submittedAt,
      cmsUrl: `${STUDIO_URL}/structure/enquiries%3Bb2bEnquiry%3B${doc._id}`,
    })
    await resend.emails.send({
      from: FROM,
      to: notif.trade,
      subject: notification.subject,
      html: notification.html,
    })

    return NextResponse.json({ success: true, id: doc._id })
  } catch (err) {
    console.error('[enquiry-b2b]', err)
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }
}
