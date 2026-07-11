import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'b2cPartsEnquiry',
  title: 'B2C Parts Enquiries',
  type: 'document',

  groups: [
    { name: 'customer', title: 'Customer', default: true },
    { name: 'part', title: 'Part Details' },
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

    // ── Part Details ──────────────────────────────────────────────
    defineField({
      name: 'partName',
      title: 'Part Name',
      type: 'string',
      group: 'part',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'partNumber',
      title: 'Part Number / OEM Reference',
      type: 'string',
      group: 'part',
    }),
    defineField({
      name: 'compatibleModel',
      title: 'Compatible Bike Model',
      type: 'string',
      group: 'part',
    }),
    defineField({
      name: 'bikeYear',
      title: 'Year of Manufacture (Your Bike)',
      type: 'number',
      group: 'part',
      validation: (R) => R.min(1950).max(2100),
    }),
    defineField({
      name: 'quantityRequired',
      title: 'Quantity Required',
      type: 'number',
      group: 'part',
      initialValue: 1,
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name: 'enquiryType',
      title: 'Type of Enquiry',
      type: 'string',
      group: 'part',
      options: {
        list: [
          { title: 'Purchase Enquiry', value: 'purchase' },
          { title: 'Availability Check', value: 'availability' },
          { title: 'Fitment Query', value: 'fitment' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      group: 'part',
      rows: 4,
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      group: 'part',
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
      partName: 'partName',
      partNumber: 'partNumber',
      status: 'status',
      date: 'submittedAt',
    },
    prepare({ title, partName, partNumber, status, date }: Record<string, any>) {
      const statusIcon = status === 'new' ? '🔴' : status === 'in-progress' ? '🟡' : '🟢'
      const d = date ? new Date(date).toLocaleDateString('en-GB') : ''
      return {
        title: `${statusIcon} ${title}`,
        subtitle: `${partName ?? '—'} ${partNumber ? `(${partNumber})` : ''} · ${d}`,
      }
    },
  },

  orderings: [
    { title: 'Newest First', name: 'newestFirst', by: [{ field: 'submittedAt', direction: 'desc' }] },
    { title: 'Status', name: 'byStatus', by: [{ field: 'status', direction: 'asc' }, { field: 'submittedAt', direction: 'desc' }] },
  ],
})
