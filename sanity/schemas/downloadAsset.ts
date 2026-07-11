import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'downloadAsset',
  title: 'Downloads & Media',
  type: 'document',

  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'file', title: 'File' },
  ],

  fields: [
    // ── Content ───────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'type',
      title: 'Asset Type',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Brochure', value: 'brochure' },
          { title: 'Spec Sheet', value: 'specsheet' },
          { title: 'Press Kit', value: 'presskit' },
          { title: 'User Manual', value: 'manual' },
          { title: 'Price List', value: 'pricelist' },
          { title: 'Parts Catalogue', value: 'parts-catalogue' },
          { title: 'Brand Asset (Logo / Guide)', value: 'brand-asset' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
    }),
    defineField({
      name: 'model',
      title: 'Related Bike Model',
      type: 'reference',
      group: 'content',
      to: [{ type: 'bikeModel' }],
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'English', value: 'en' },
          { title: 'Italian', value: 'it' },
          { title: 'French', value: 'fr' },
          { title: 'German', value: 'de' },
          { title: 'Spanish', value: 'es' },
          { title: 'Arabic', value: 'ar' },
        ],
        layout: 'radio',
      },
      initialValue: 'en',
    }),
    defineField({
      name: 'isPublic',
      title: 'Publicly downloadable (no gating)',
      type: 'boolean',
      group: 'content',
      initialValue: true,
    }),

    // ── File ──────────────────────────────────────────────────────
    defineField({
      name: 'file',
      title: 'File',
      type: 'file',
      group: 'file',
      options: { accept: '.pdf,.zip,.doc,.docx,.svg,.png,.ai,.eps' },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'fileSize',
      title: 'File Size (display only)',
      type: 'string',
      group: 'file',
      description: 'e.g. "2.5 MB"',
    }),
    defineField({
      name: 'publishedDate',
      title: 'Published Date',
      type: 'date',
      group: 'file',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      type: 'type',
      language: 'language',
      model: 'model.name',
      media: 'thumbnail',
    },
    prepare({ title, type, language, model, media }: Record<string, any>) {
      const typeIcons: Record<string, string> = { brochure: '📄', specsheet: '📋', presskit: '📦', manual: '📖', pricelist: '💶', 'parts-catalogue': '🔩' }
      return {
        title: `${typeIcons[type] ?? '📎'} ${title}`,
        subtitle: `${type ?? ''} · ${(language ?? 'en').toUpperCase()}${model ? ` · ${model}` : ''}`,
        media,
      }
    },
  },

  orderings: [
    { title: 'Title A–Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
    { title: 'Type', name: 'byType', by: [{ field: 'type', direction: 'asc' }, { field: 'title', direction: 'asc' }] },
    { title: 'Published Date, Newest', name: 'newestFirst', by: [{ field: 'publishedDate', direction: 'desc' }] },
  ],
})
