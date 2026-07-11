import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'b2cEnquiry',
  title: 'B2C Customer Enquiries',
  type: 'document',

  groups: [
    { name: 'customer', title: 'Customer', default: true },
    { name: 'enquiry', title: 'Enquiry Details' },
    { name: 'crm', title: 'CRM / Internal' },
  ],

  fields: [
    // ── Customer ──────────────────────────────────────────────────
    defineField({
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
      group: 'customer',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'email',
      group: 'customer',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      group: 'customer',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'gdprConsent',
      title: 'GDPR Consent Given',
      type: 'boolean',
      group: 'customer',
      validation: (R) => R.required(),
    }),

    // ── Enquiry ───────────────────────────────────────────────────
    defineField({
      name: 'enquiryType',
      title: 'Type of Enquiry',
      type: 'string',
      group: 'enquiry',
      options: {
        list: [
          { title: 'General Enquiry', value: 'general' },
          { title: 'Test Ride', value: 'test-ride' },
          { title: 'Purchase', value: 'purchase' },
          { title: 'After Sales', value: 'after-sales' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'modelInterested',
      title: 'Model Interested In',
      type: 'string',
      group: 'enquiry',
    }),
    defineField({
      name: 'preferredDealer',
      title: 'Preferred Dealer Location',
      type: 'string',
      group: 'enquiry',
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      group: 'enquiry',
      rows: 5,
      validation: (R) => R.required().min(10),
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      group: 'enquiry',
      validation: (R) => R.required(),
    }),

    // ── CRM ───────────────────────────────────────────────────────
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'crm',
      options: {
        list: [
          { title: '🔴 New', value: 'new' },
          { title: '🟡 In Progress', value: 'in-progress' },
          { title: '🟢 Closed', value: 'closed' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'assignedTo',
      title: 'Assigned To',
      type: 'string',
      group: 'crm',
    }),
    defineField({
      name: 'internalNotes',
      title: 'Internal Notes',
      type: 'text',
      group: 'crm',
      rows: 4,
    }),
  ],

  preview: {
    select: {
      title: 'fullName',
      enquiryType: 'enquiryType',
      model: 'modelInterested',
      status: 'status',
      date: 'submittedAt',
    },
    prepare({ title, enquiryType, model, status, date }: Record<string, any>) {
      const statusIcon = status === 'new' ? '🔴' : status === 'in-progress' ? '🟡' : '🟢'
      const d = date ? new Date(date).toLocaleDateString('en-GB') : ''
      return {
        title: `${statusIcon} ${title}`,
        subtitle: `${enquiryType ?? 'General'} · ${model ?? 'No model'} · ${d}`,
      }
    },
  },

  orderings: [
    { title: 'Newest First', name: 'newestFirst', by: [{ field: 'submittedAt', direction: 'desc' }] },
    { title: 'Status', name: 'byStatus', by: [{ field: 'status', direction: 'asc' }, { field: 'submittedAt', direction: 'desc' }] },
  ],
})
