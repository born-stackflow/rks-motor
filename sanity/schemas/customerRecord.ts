import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'customerRecord',
  title: 'Customer & Partner Records',
  type: 'document',

  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'crm', title: 'CRM' },
  ],

  fields: [
    defineField({
      name: 'recordType',
      title: 'Record Type',
      type: 'string',
      group: 'identity',
      options: {
        list: [
          { title: '👤 B2C — Individual Customer', value: 'b2c' },
          { title: '🏢 B2B — Business / Partner', value: 'b2b' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),

    // B2C fields
    defineField({
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
      group: 'identity',
      description: 'For individual customers',
    }),

    // B2B fields
    defineField({
      name: 'businessName',
      title: 'Business Name',
      type: 'string',
      group: 'identity',
      description: 'For business / partner records',
    }),
    defineField({
      name: 'vatNumber',
      title: 'VAT / Registration Number',
      type: 'string',
      group: 'identity',
    }),
    defineField({
      name: 'contactName',
      title: 'Contact Person',
      type: 'string',
      group: 'identity',
      description: 'Primary contact at the business',
    }),

    // Shared contact
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      group: 'contact',
      rows: 3,
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      group: 'contact',
    }),

    // CRM
    defineField({
      name: 'followUpDate',
      title: 'Follow-Up Date',
      type: 'date',
      group: 'crm',
      description: 'Set a date to remind the team to follow up with this contact',
    }),
    defineField({
      name: 'documents',
      title: 'Attached Documents',
      type: 'array',
      group: 'crm',
      description: 'Upload contracts, signed agreements, quotes, or any other documents',
      of: [
        {
          type: 'object',
          name: 'attachment',
          fields: [
            defineField({
              name: 'title',
              title: 'Document Title',
              type: 'string',
              validation: (R) => R.required(),
              description: 'e.g. Signed Dealer Agreement, Trade Quote, Contract',
            }),
            defineField({
              name: 'file',
              title: 'File',
              type: 'file',
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'uploadedAt',
              title: 'Date',
              type: 'date',
            }),
          ],
          preview: {
            select: { title: 'title', date: 'uploadedAt' },
            prepare({ title, date }: Record<string, any>) {
              return { title: title ?? 'Untitled', subtitle: date ?? '' }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      group: 'crm',
      rows: 4,
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      group: 'crm',
    }),
  ],

  preview: {
    select: {
      fullName: 'fullName',
      businessName: 'businessName',
      type: 'recordType',
      country: 'country',
    },
    prepare({ fullName, businessName, type, country }: Record<string, any>) {
      const icon = type === 'b2b' ? '🏢' : '👤'
      return {
        title: `${icon} ${fullName || businessName || 'Unnamed'}`,
        subtitle: country ?? '',
      }
    },
  },

  orderings: [
    { title: 'Name A–Z', name: 'nameAsc', by: [{ field: 'fullName', direction: 'asc' }] },
    { title: 'Business A–Z', name: 'businessAsc', by: [{ field: 'businessName', direction: 'asc' }] },
    { title: 'Follow-Up Date', name: 'followUp', by: [{ field: 'followUpDate', direction: 'asc' }] },
  ],
})
