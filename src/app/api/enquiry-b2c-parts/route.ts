import { z } from 'zod'
import { createEnquiryHandler, email, formEnvelope, optionalText, text } from '@/lib/server/enquiry'
import { partsEmails } from '@/lib/email/enquiries'

const schema = z.object({
  ...formEnvelope,
  fullName: text(120),
  email: email(),
  phone: text(40),
  partName: text(160),
  partNumber: optionalText(80),
  compatibleModel: optionalText(120),
  bikeYear: z.number().int().min(1950).max(2100).optional(),
  quantityRequired: z.number().int().min(1).max(10_000).default(1),
  enquiryType: z.enum(['purchase', 'availability', 'fitment', 'other']),
  message: optionalText(5000),
})

const emails = partsEmails('b2c')
const toParts = (d: z.infer<typeof schema>) => ({ ...d, name: d.fullName })

export const POST = createEnquiryHandler({
  name: 'enquiry-b2c-parts',
  type: 'b2cPartsEnquiry',
  schema,
  recipient: 'parts',
  toDocument: (d) => ({
    fullName: d.fullName,
    email: d.email,
    phone: d.phone,
    partName: d.partName,
    partNumber: d.partNumber || undefined,
    compatibleModel: d.compatibleModel || undefined,
    bikeYear: d.bikeYear,
    quantityRequired: d.quantityRequired,
    enquiryType: d.enquiryType,
    message: d.message || undefined,
  }),
  customerEmail: (d) => d.email,
  confirmation: (d, ctx) => emails.confirmation(toParts(d), ctx),
  notification: (d, ctx) => emails.notification(toParts(d), ctx),
})
