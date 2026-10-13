import { z } from 'zod'
import { createEnquiryHandler, email, formEnvelope, optionalText, text } from '@/lib/server/enquiry'
import { b2bEmails } from '@/lib/email/enquiries'

const schema = z.object({
  ...formEnvelope,
  businessName: text(160),
  businessType: z.enum(['dealer', 'distributor', 'wholesaler', 'fleet', 'importer', 'other']),
  vatNumber: text(40),
  address: text(200),
  city: text(120),
  country: text(120),
  contactName: text(120),
  jobTitle: text(120),
  email: email(),
  phone: text(40),
  whatsapp: optionalText(40),
  website: z.union([z.url({ protocol: /^https?$/ }).max(300), z.literal('')]).optional(),
  modelsOfInterest: z.array(z.string().trim().max(120)).max(30).default([]),
  estimatedQuantity: z.enum(['1-5', '6-15', '16-30', '30+']).optional(),
  hasShowroom: z.boolean().optional(),
  referralSource: z.enum(['google', 'trade-show', 'referral', 'social-media', 'other']).optional(),
  message: optionalText(5000),
})

export const POST = createEnquiryHandler({
  name: 'enquiry-b2b',
  type: 'b2bEnquiry',
  schema,
  recipient: 'trade',
  toDocument: (d) => ({
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
    whatsapp: d.whatsapp || undefined,
    website: d.website || undefined,
    modelsOfInterest: d.modelsOfInterest,
    estimatedQuantity: d.estimatedQuantity,
    hasShowroom: d.hasShowroom ?? false,
    referralSource: d.referralSource,
    message: d.message || undefined,
  }),
  customerEmail: (d) => d.email,
  confirmation: b2bEmails.confirmation,
  notification: b2bEmails.notification,
})
