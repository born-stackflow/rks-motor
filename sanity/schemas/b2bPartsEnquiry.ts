import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'b2bPartsEnquiry',
  title: 'B2B Parts / Bulk Orders',
  type: 'document',

  groups: [
    { name: 'business', title: 'Business', default: true },
    { name: 'order', title: 'Order Details' },
    { name: 'crm', title: 'CRM / Internal' },
  ],

  fields: [
    // ── Business ──────────────────────────────────────────────────
    defineField({
      name: 'businessName',
      title: 'Business / Company Name',
      type: 'string',
      group: 'business',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'vatNumber',
      title: 'VAT / Business Registration Number',
      type: 'string',
      group: 'business',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'contactName',
      title: 'Contact Person Name',
      type: 'string',
      group: 'business',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'email',
      group: 'business',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      group: 'business',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'gdprConsent',
      title: 'GDPR Consent Given',
      type: 'boolean',
      group: 'business',
      validation: (R) => R.required(),
    }),

    // ── Order Details ─────────────────────────────────────────────
    defineField({
      name: 'partName',
      title: 'Part Name',
      type: 'string',
      group: 'order',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'partNumber',
      title: 'Part Number / OEM Reference',
      type: 'string',
      group: 'order',
    }),
    defineField({
      name: 'compatibleModel',
      title: 'Compatible Bike Model',
      type: 'string',
      group: 'order',
    }),
    defineField({
      name: 'quantityRequired',
      title: 'Quantity Required',
      type: 'number',
      group: 'order',
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name: 'isRecurringOrder',
      title: 'Is this a recurring order?',
      type: 'boolean',
      group: 'order',
      initialValue: false,
    }),
    defineField({
      name: 'monthlyQuantity',
      title: 'Approximate Monthly Quantity',
      type: 'number',
      group: 'order',
      hidden: ({ document }: any) => !document?.isRecurringOrder,
      validation: (R) => R.min(1),
    }),
    defineField({
      name: 'message',
      title: 'Message / Special Requirements',
      type: 'text',
      group: 'order',
      rows: 4,
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      group: 'order',
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
          { title: '📧 Offer Sent', value: 'offer-sent' },
          { title: '🤝 Negotiating', value: 'negotiating' },
          { title: '🟢 Closed / Won', value: 'closed' },
          { title: '❌ Declined', value: 'declined' },
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
      title: 'businessName',
      partName: 'partName',
      partNumber: 'partNumber',
      quantity: 'quantityRequired',
      status: 'status',
      date: 'submittedAt',
    },
    prepare({ title, partName, partNumber, quantity, status, date }: Record<string, any>) {
      const icons: Record<string, string> = { new: '🔴', 'offer-sent': '📧', negotiating: '🤝', closed: '🟢', declined: '❌' }
      const d = date ? new Date(date).toLocaleDateString('en-GB') : ''
      return {
        title: `${icons[status] ?? ''} ${title}`,
        subtitle: `${partName ?? '—'} ${partNumber ? `(${partNumber})` : ''} · Qty: ${quantity ?? '?'} · ${d}`,
      }
    },
  },

  orderings: [
    { title: 'Newest First', name: 'newestFirst', by: [{ field: 'submittedAt', direction: 'desc' }] },
    { title: 'Status', name: 'byStatus', by: [{ field: 'status', direction: 'asc' }, { field: 'submittedAt', direction: 'desc' }] },
  ],
})
