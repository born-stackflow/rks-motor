import { z } from 'zod'
import { createEnquiryHandler, email, formEnvelope, optionalText, text } from '@/lib/server/enquiry'
import { partsEmails } from '@/lib/email/enquiries'

const schema = z.object({
  ...formEnvelope,
  businessName: text(160),
  vatNumber: text(40),
  contactName: text(120),
  email: email(),
  phone: text(40),
  partName: text(160),
  partNumber: optionalText(80),
  compatibleModel: optionalText(120),
  quantityRequired: z.number().int().min(1).max(100_000),
  isRecurringOrder: z.boolean().default(false),
  monthlyQuantity: z.number().int().min(1).max(100_000).optional(),
  message: optionalText(5000),
})

const emails = partsEmails('b2b')
const toParts = (d: z.infer<typeof schema>) => ({ ...d, name: d.contactName })

export const POST = createEnquiryHandler({
  name: 'enquiry-b2b-parts',
  type: 'b2bPartsEnquiry',
  schema,
  recipient: 'trade',
  toDocument: (d) => ({
    businessName: d.businessName,
    vatNumber: d.vatNumber,
    contactName: d.contactName,
    email: d.email,
    phone: d.phone,
    partName: d.partName,
    partNumber: d.partNumber || undefined,
    compatibleModel: d.compatibleModel || undefined,
    quantityRequired: d.quantityRequired,
    isRecurringOrder: d.isRecurringOrder,
    monthlyQuantity: d.isRecurringOrder ? d.monthlyQuantity : undefined,
    message: d.message || undefined,
  }),
  customerEmail: (d) => d.email,
  confirmation: (d, ctx) => emails.confirmation(toParts(d), ctx),
  notification: (d, ctx) => emails.notification(toParts(d), ctx),
})
