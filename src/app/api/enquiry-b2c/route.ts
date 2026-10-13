import { z } from 'zod'
import { createEnquiryHandler, email, formEnvelope, optionalText, text } from '@/lib/server/enquiry'
import { b2cEmails } from '@/lib/email/enquiries'

const schema = z.object({
  ...formEnvelope,
  fullName: text(120),
  email: email(),
  phone: text(40),
  modelInterested: optionalText(120),
  enquiryType: z.enum(['general', 'test-ride', 'purchase', 'after-sales', 'other']),
  preferredDealer: optionalText(120),
  message: z.string().trim().min(10).max(5000),
})

export const POST = createEnquiryHandler({
  name: 'enquiry-b2c',
  type: 'b2cEnquiry',
  schema,
  recipient: 'sales',
  toDocument: (d) => ({
    fullName: d.fullName,
    email: d.email,
    phone: d.phone,
    modelInterested: d.modelInterested || undefined,
    enquiryType: d.enquiryType,
    preferredDealer: d.preferredDealer || undefined,
    message: d.message,
  }),
  customerEmail: (d) => d.email,
  confirmation: b2cEmails.confirmation,
  notification: b2cEmails.notification,
})
