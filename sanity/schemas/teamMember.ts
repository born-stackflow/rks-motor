import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'teamMember',
  title: 'Team Members',
  type: 'document',

  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Job Title',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'department',
      title: 'Department',
      type: 'string',
      options: {
        list: [
          { title: 'Leadership', value: 'leadership' },
          { title: 'Engineering', value: 'engineering' },
          { title: 'Design', value: 'design' },
          { title: 'Sales & Marketing', value: 'sales' },
          { title: 'Operations', value: 'operations' },
          { title: 'After Sales', value: 'after-sales' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Short Bio',
      type: 'text',
      rows: 3,
      validation: (R) => R.max(300),
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower = shown first',
      validation: (R) => R.required().min(0),
    }),
    defineField({
      name: 'isVisible',
      title: 'Show on About page',
      type: 'boolean',
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: 'name',
      role: 'role',
      department: 'department',
      media: 'photo',
    },
    prepare({ title, role, department, media }: Record<string, any>) {
      return {
        title,
        subtitle: `${role ?? ''}${department ? ` · ${department}` : ''}`,
        media,
      }
    },
  },

  orderings: [
    { title: 'Display Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'Name A–Z', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
  ],
})
