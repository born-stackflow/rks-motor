import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'staffMember',
  title: 'Staff Members & Roles',
  type: 'document',

  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'access', title: 'Access & Role' },
  ],

  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      group: 'identity',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      group: 'identity',
      description: 'Must match the email they use to log in to Sanity',
      validation: (R) => R.required().email(),
    }),
    defineField({
      name: 'jobTitle',
      title: 'Job Title',
      type: 'string',
      group: 'identity',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      group: 'identity',
    }),
    defineField({
      name: 'department',
      title: 'Department',
      type: 'string',
      group: 'identity',
      options: {
        list: [
          { title: '👔 Management', value: 'management' },
          { title: '💰 Sales', value: 'sales' },
          { title: '🔧 Parts & Service', value: 'parts' },
          { title: '📦 Warehouse / Stock', value: 'warehouse' },
          { title: '📣 Marketing', value: 'marketing' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'sanityRole',
      title: 'CMS Role',
      type: 'string',
      group: 'access',
      description:
        'Choose the role that matches what you set for this person in sanity.io/manage → Members. The Studio hides or reveals sections based on this role.',
      options: {
        list: [
          {
            title: '🔑 Administrator — Full access: enquiries, catalogue, orders, stock, customer records, settings',
            value: 'administrator',
          },
          {
            title: '✏️ Editor — Enquiries, catalogue, editorial, company content only (no orders, stock, or customer records)',
            value: 'editor',
          },
          {
            title: '👁 Viewer — Read-only access to all visible sections',
            value: 'viewer',
          },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      group: 'access',
      rows: 3,
    }),
  ],

  preview: {
    select: {
      name: 'name',
      department: 'department',
      role: 'sanityRole',
      jobTitle: 'jobTitle',
    },
    prepare({ name, department, role, jobTitle }: Record<string, any>) {
      const roleIcon =
        role === 'administrator' ? '🔑' : role === 'editor' ? '✏️' : '👁'
      return {
        title: `${roleIcon} ${name || 'Unnamed'}`,
        subtitle: [jobTitle, department].filter(Boolean).join(' · ') || '',
      }
    },
  },

  orderings: [
    { title: 'Name A–Z', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
    { title: 'Department', name: 'byDept', by: [{ field: 'department', direction: 'asc' }] },
  ],
})
