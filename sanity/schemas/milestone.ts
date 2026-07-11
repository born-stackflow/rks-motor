import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'milestone',
  title: 'Company Milestones',
  type: 'document',

  fields: [
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (R) => R.required().min(1900).max(2100),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (R) => R.required().max(100),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (R) => R.required().max(500),
    }),
    defineField({
      name: 'image',
      title: 'Image (optional)',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Company Founded', value: 'founding' },
          { title: 'Product Launch', value: 'launch' },
          { title: 'Award', value: 'award' },
          { title: 'Expansion', value: 'expansion' },
          { title: 'Technology', value: 'technology' },
          { title: 'Milestone', value: 'milestone' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'isHighlight',
      title: 'Highlight (show prominently)',
      type: 'boolean',
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      year: 'year',
      title: 'title',
      category: 'category',
      media: 'image',
    },
    prepare({ year, title, category, media }: Record<string, any>) {
      return {
        title: `${year}: ${title}`,
        subtitle: category ?? '',
        media,
      }
    },
  },

  orderings: [
    { title: 'Year, Newest', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] },
    { title: 'Year, Oldest', name: 'yearAsc', by: [{ field: 'year', direction: 'asc' }] },
  ],
})
