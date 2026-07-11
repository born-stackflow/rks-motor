import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'Blog Posts',
  type: 'document',

  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'Metadata' },
    { name: 'seo', title: 'SEO' },
  ],

  fields: [
    // ── Identity ──────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (R) => R.required().min(5).max(120),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'News', value: 'news' },
          { title: 'Model Launches', value: 'launches' },
          { title: 'Events', value: 'events' },
          { title: 'Press Releases', value: 'press' },
          { title: 'Technology', value: 'technology' },
          { title: 'Lifestyle', value: 'lifestyle' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
        defineField({ name: 'caption', title: 'Caption', type: 'string' }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'Short summary shown in cards and search results',
      validation: (R) => R.required().max(200),
    }),
    defineField({
      name: 'body',
      title: 'Content',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Heading 4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
            annotations: [
              {
                title: 'Link',
                name: 'link',
                type: 'object',
                fields: [
                  defineField({ name: 'href', title: 'URL', type: 'url' }),
                  defineField({
                    name: 'blank',
                    title: 'Open in new tab',
                    type: 'boolean',
                    initialValue: false,
                  }),
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
          ],
        },
      ],
    }),

    // ── Metadata ───────────────────────────────────────────────────
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      group: 'meta',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'publishedDate',
      title: 'Published Date',
      type: 'datetime',
      group: 'meta',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'relatedModels',
      title: 'Related Bike Models',
      type: 'array',
      group: 'meta',
      of: [{ type: 'reference', to: [{ type: 'bikeModel' }] }],
      validation: (R) => R.max(3),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'meta',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'isFeatured',
      title: 'Feature on Homepage',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
    }),

    // ── SEO ────────────────────────────────────────────────────────
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
      description: 'Defaults to post title if blank',
      validation: (R) => R.max(70),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      group: 'seo',
      rows: 3,
      validation: (R) => R.max(160),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      category: 'category',
      featured: 'isFeatured',
      date: 'publishedDate',
      media: 'featuredImage',
    },
    prepare({ title, author, category, featured, date, media }: Record<string, any>) {
      const cats: Record<string, string> = { news: '📰', launches: '🏍️', events: '🎪', press: '📋', technology: '⚙️', lifestyle: '🌄' }
      const d = date ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
      return {
        title: `${featured ? '⭐ ' : ''}${cats[category] ?? ''} ${title}`,
        subtitle: `${author ? `by ${author} · ` : ''}${d}`,
        media,
      }
    },
  },

  orderings: [
    { title: 'Published Date, Newest', name: 'publishedDateDesc', by: [{ field: 'publishedDate', direction: 'desc' }] },
    { title: 'Published Date, Oldest', name: 'publishedDateAsc', by: [{ field: 'publishedDate', direction: 'asc' }] },
    { title: 'Featured First', name: 'featured', by: [{ field: 'isFeatured', direction: 'desc' }, { field: 'publishedDate', direction: 'desc' }] },
  ],
})
