import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'b2bEnquiry',
  title: 'B2B Trade Applications',
  type: 'document',

  groups: [
    { name: 'business', title: 'Business', default: true },
    { name: 'contact', title: 'Contact Person' },
    { name: 'trade', title: 'Trade Details' },
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
      name: 'businessType',
      title: 'Business Type',
      type: 'string',
      group: 'business',
      options: {
        list: [
          { title: 'Motorcycle Dealer', value: 'dealer' },
          { title: 'Distributor', value: 'distributor' },
          { title: 'Wholesaler', value: 'wholesaler' },
          { title: 'Fleet Buyer', value: 'fleet' },
          { title: 'Importer', value: 'importer' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'vatNumber',
      title: 'VAT / Business Registration Number',
      type: 'string',
      group: 'business',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'address',
      title: 'Business Address',
      type: 'text',
      group: 'business',
      rows: 2,
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      group: 'business',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      group: 'business',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'website',
      title: 'Website URL',
      type: 'url',
      group: 'business',
    }),
    defineField({
      name: 'hasShowroom',
      title: 'Has existing showroom?',
      type: 'boolean',
      group: 'business',
      initialValue: false,
    }),

    // ── Contact ───────────────────────────────────────────────────
    defineField({
      name: 'contactName',
      title: 'Contact Person Full Name',
      type: 'string',
      group: 'contact',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'jobTitle',
      title: 'Job Title / Role',
      type: 'string',
      group: 'contact',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'email',
      group: 'contact',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      group: 'contact',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp Number',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'gdprConsent',
      title: 'GDPR Consent Given',
      type: 'boolean',
      group: 'contact',
      validation: (R) => R.required(),
    }),

    // ── Trade Details ─────────────────────────────────────────────
    defineField({
      name: 'modelsOfInterest',
      title: 'Models of Interest',
      type: 'array',
      group: 'trade',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'estimatedQuantity',
      title: 'Estimated Monthly Order Quantity',
      type: 'string',
      group: 'trade',
      options: {
        list: [
          { title: '1–5 units', value: '1-5' },
          { title: '6–15 units', value: '6-15' },
          { title: '16–30 units', value: '16-30' },
          { title: '30+ units', value: '30+' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'referralSource',
      title: 'How did you hear about us?',
      type: 'string',
      group: 'trade',
      options: {
        list: [
          { title: 'Google', value: 'google' },
          { title: 'Trade Show', value: 'trade-show' },
          { title: 'Referral', value: 'referral' },
          { title: 'Social Media', value: 'social-media' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'message',
      title: 'Additional Requirements / Message',
      type: 'text',
      group: 'trade',
      rows: 4,
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      group: 'trade',
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
      country: 'country',
      quantity: 'estimatedQuantity',
      status: 'status',
      date: 'submittedAt',
    },
    prepare({ title, country, quantity, status, date }: Record<string, any>) {
      const icons: Record<string, string> = { new: '🔴', 'offer-sent': '📧', negotiating: '🤝', closed: '🟢', declined: '❌' }
      const d = date ? new Date(date).toLocaleDateString('en-GB') : ''
      return {
        title: `${icons[status] ?? ''} ${title}`,
        subtitle: `${country ?? ''} · ${quantity ?? '?'} units/mo · ${d}`,
      }
    },
  },

  orderings: [
    { title: 'Newest First', name: 'newestFirst', by: [{ field: 'submittedAt', direction: 'desc' }] },
    { title: 'Status', name: 'byStatus', by: [{ field: 'status', direction: 'asc' }, { field: 'submittedAt', direction: 'desc' }] },
    { title: 'Country A–Z', name: 'countryAsc', by: [{ field: 'country', direction: 'asc' }] },
  ],
})
