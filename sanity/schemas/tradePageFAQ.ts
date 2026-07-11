import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'tradePageFAQ',
  title: 'Trade Page FAQs',
  type: 'document',

  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (R) => R.required().max(200),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 4', value: 'h4' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
          },
        },
      ],
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Becoming a Partner', value: 'onboarding' },
          { title: 'Orders & Delivery', value: 'orders' },
          { title: 'Pricing & Terms', value: 'pricing' },
          { title: 'Technical & Support', value: 'technical' },
          { title: 'General', value: 'general' },
        ],
        layout: 'radio',
      },
      initialValue: 'general',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower = shown first within category',
      validation: (R) => R.required().min(0),
    }),
    defineField({
      name: 'isVisible',
      title: 'Visible on site',
      type: 'boolean',
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: 'question',
      order: 'order',
      category: 'category',
      visible: 'isVisible',
    },
    prepare({ title, order, category, visible }: Record<string, any>) {
      return {
        title: `${visible === false ? '🔒 ' : ''}${title}`,
        subtitle: `${category ?? 'general'} · #${order ?? '?'}`,
      }
    },
  },

  orderings: [
    { title: 'Display Order', name: 'order', by: [{ field: 'category', direction: 'asc' }, { field: 'order', direction: 'asc' }] },
  ],
})
