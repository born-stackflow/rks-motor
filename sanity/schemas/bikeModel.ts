import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'bikeModel',
  title: 'E-Bike Models',
  type: 'document',

  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'specs', title: 'Specifications' },
    { name: 'media', title: 'Images & Colours' },
    { name: 'pricing', title: 'Pricing & Availability' },
    { name: 'seo', title: 'SEO' },
  ],

  fields: [
    // ── Identity ─────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Model Name',
      type: 'string',
      group: 'content',
      validation: (R) => R.required().min(2).max(80),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'name', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      title: 'Brand / Company',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Ape Ryder', value: 'aperyder' },
          { title: 'RKS',       value: 'rks'      },
          { title: 'Skyjet',    value: 'skyjet'   },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'content',
      description: 'Short 1-line tagline shown under the model name',
      validation: (R) => R.max(80),
    }),
    defineField({
      name: 'description',
      title: 'Model Description',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'keyFeatures',
      title: 'Feature Showcase (with Images)',
      description: 'Up to 6 highlighted features shown in the interactive numbered showcase section. Each item needs a close-up photo uploaded here.',
      type: 'array',
      group: 'content',
      validation: (R) => R.max(6),
      of: [
        {
          type: 'object',
          name: 'keyFeature',
          fields: [
            defineField({
              name: 'title',
              title: 'Feature Title',
              type: 'string',
              description: 'e.g. SHIMANO 7-SPEED GEAR, HYDRAULIC DISC BRAKE',
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'image',
              title: 'Feature Close-up Image',
              type: 'image',
              options: { hotspot: true },
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'description',
              title: 'Short Description',
              type: 'text',
              rows: 2,
              description: 'One or two sentences describing this feature',
            }),
          ],
          preview: {
            select: { title: 'title', media: 'image' },
          },
        },
      ],
    }),
    defineField({
      name: 'features',
      title: 'Additional Features (text list)',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      description: 'Extra features shown as a simple checklist — use when you have more than 6 items',
    }),

    defineField({
      name: 'hotspots',
      title: 'Interactive Feature Hotspots',
      description: 'Clickable dots placed on the bike image. Enter X/Y as a percentage of the image (0 = left/top edge, 100 = right/bottom edge).',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'hotspot',
          fields: [
            defineField({ name: 'label',       title: 'Category Tag',      type: 'string', description: 'Short tag shown in the badge, e.g. ENERGY, SEATING, BRAKES' }),
            defineField({ name: 'title',        title: 'Feature Title',     type: 'string', description: 'Bold headline shown on hover, e.g. 48V 15Ah Battery' }),
            defineField({ name: 'description',  title: 'Description',       type: 'text',   rows: 3 }),
            defineField({ name: 'highlight',    title: 'Highlight Value',   type: 'string', description: 'Gold-coloured callout, e.g. 50–60 km or 2 Person Capacity' }),
            defineField({ name: 'x',            title: 'X Position (%)',    type: 'number', description: '0 = left edge · 100 = right edge', validation: R => R.required().min(0).max(100) }),
            defineField({ name: 'y',            title: 'Y Position (%)',    type: 'number', description: '0 = top · 100 = bottom',           validation: R => R.required().min(0).max(100) }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'label' },
          },
        },
      ],
    }),

    // ── Pricing & Availability ─────────────────────────────────────
    defineField({
      name: 'price',
      title: 'RRP Price (€)',
      type: 'number',
      group: 'pricing',
      validation: (R) => R.min(0),
    }),
    defineField({
      name: 'availability',
      title: 'Availability',
      type: 'string',
      group: 'pricing',
      options: {
        list: [
          { title: 'In Stock', value: 'in-stock' },
          { title: 'Pre-Order', value: 'pre-order' },
          { title: 'Coming Soon', value: 'coming-soon' },
          { title: 'Discontinued', value: 'discontinued' },
        ],
        layout: 'radio',
      },
      initialValue: 'in-stock',
    }),
    defineField({
      name: 'b2cPriceNote',
      title: 'B2C Price Note',
      type: 'string',
      group: 'pricing',
      description: 'Short note shown below the price for end customers, e.g. "Free delivery included" or "VAT included · 2-year warranty"',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Feature on Homepage',
      type: 'boolean',
      group: 'pricing',
      initialValue: false,
    }),
    defineField({
      name: 'isNew',
      title: 'Show "New" Badge',
      type: 'boolean',
      group: 'pricing',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'pricing',
      description: 'Lower number = shown first. Leave blank for alphabetical.',
    }),

    // ── Images & Colours ──────────────────────────────────────────
    defineField({
      name: 'heroImage',
      title: '① Hero Banner Image  (1 image — full-screen background only)',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      description: 'ONLY used for the dramatic full-screen banner at the very top of the page. This image does NOT appear in the product panel or gallery — upload those separately below.',
      validation: (R) => R.required(),
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'hotspotImage',
      title: '② Hotspot Section Image  (1 image — for interactive feature dots)',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      description: 'The image shown behind the clickable feature dots section. Use a clear side-profile or 3/4 view of the bike. Completely separate from the hero and product images.',
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: '③ Product Images  (shown in the product / Add-to-Cart panel + gallery grid)',
      type: 'array',
      group: 'media',
      description: 'These images appear in the product section below the hero, and in the full gallery grid. Upload multiple angles here (front, side, detail shots). These are NOT the hero or hotspot images.',
      of: [
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
    defineField({
      name: 'colours',
      title: 'Available Colours  ← Upload one bike photo per colour',
      type: 'array',
      group: 'media',
      description: 'Each colour entry needs its own bike photo — when the customer clicks a colour swatch, the product image changes to that colour\'s photo automatically.',
      of: [
        {
          type: 'object',
          name: 'colour',
          fields: [
            defineField({ name: 'name', title: 'Colour Name', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'hex', title: 'Hex / Colour Code', type: 'string', description: 'e.g. #1E40AF for blue — used for the swatch dot' }),
            defineField({ name: 'image', title: 'Bike Photo for This Colour  ✦ Required', type: 'image', options: { hotspot: true }, description: 'Upload the bike photo in this specific colour. Shown when the customer selects this colour swatch.' }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'hex', media: 'image' },
          },
        },
      ],
    }),

    // ── Specifications ─────────────────────────────────────────────
    defineField({
      name: 'specs',
      title: 'Technical Specifications',
      type: 'object',
      group: 'specs',
      fields: [
        // Motor & Battery
        defineField({ name: 'motor',        title: 'Motor',                 type: 'string', description: 'e.g. 48V 250W' }),
        defineField({ name: 'maxSpeed',     title: 'Maximum Speed (km/h)',  type: 'number' }),
        defineField({ name: 'ridingModes',  title: 'Riding Modes',          type: 'string', description: 'e.g. 5 Different Riding Modes' }),
        defineField({ name: 'range',        title: 'Range',                 type: 'string', description: 'e.g. 50-60 km' }),
        defineField({ name: 'battery',      title: 'Battery',               type: 'string', description: 'e.g. 48V 15Ah' }),
        defineField({ name: 'chargingTime', title: 'Charging Time',         type: 'string', description: 'e.g. 6-7 Hours' }),
        // Display & Lights
        defineField({ name: 'displayPanel', title: 'Display Panel',         type: 'string' }),
        defineField({ name: 'frontLight',   title: 'Front Light',           type: 'string' }),
        defineField({ name: 'rearLight',    title: 'Rear Light',            type: 'string' }),
        // Suspension & Brakes
        defineField({ name: 'frontFork',      title: 'Front Fork',          type: 'string', description: 'e.g. Lockable Suspension Fork' }),
        defineField({ name: 'rearSuspension', title: 'Rear Suspension',     type: 'string' }),
        defineField({ name: 'brakes',         title: 'Brakes',              type: 'string', description: 'e.g. Hydraulic Disc Brake Karasawa' }),
        defineField({ name: 'tires',          title: 'Tires',               type: 'string', description: 'e.g. 20 x 4.0 (KENDA)' }),
        // Drivetrain
        defineField({ name: 'gearSystem', title: 'Gear System',  type: 'string', description: 'e.g. Shimano TX50, 7SP' }),
        defineField({ name: 'chainring',  title: 'Chainring',    type: 'string', description: 'e.g. Shimano MF-TZ510, 7SP' }),
        defineField({ name: 'derailleur', title: 'Derailleur',   type: 'string', description: 'e.g. Shimano RD-TY300, 7SP' }),
        // Frame & Body
        defineField({ name: 'frame',       title: 'Frame',        type: 'string', description: 'e.g. 20" Steel' }),
        defineField({ name: 'saddle',      title: 'Saddle',       type: 'string' }),
        defineField({ name: 'pedals',      title: 'Pedals',       type: 'string' }),
        defineField({ name: 'bag',         title: 'Bag / Carrier', type: 'string' }),
        defineField({ name: 'fender',      title: 'Fender',       type: 'string' }),
        defineField({ name: 'rearCarrier', title: 'Rear Carrier', type: 'string' }),
        defineField({ name: 'weight',      title: 'Weight',       type: 'string', description: 'e.g. 44 kg / 164 kg' }),
      ],
    }),

    // ── Relations ─────────────────────────────────────────────────
    defineField({
      name: 'relatedModels',
      title: 'Related Models',
      type: 'array',
      group: 'content',
      of: [{ type: 'reference', to: [{ type: 'bikeModel' }] }],
      validation: (R) => R.max(4),
    }),
    defineField({
      name: 'specSheetPDF',
      title: 'Spec Sheet PDF',
      type: 'file',
      group: 'content',
      options: { accept: '.pdf' },
    }),

    // ── SEO ────────────────────────────────────────────────────────
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
      description: 'Defaults to model name if left blank',
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
      title: 'name',
      category: 'category',
      price: 'price',
      featured: 'isFeatured',
      availability: 'availability',
      media: 'heroImage',
    },
    prepare({ title, category, price, featured, availability, media }: Record<string, any>) {
      const cats: Record<string, string> = {
        aperyder: 'Ape Ryder', rks: 'RKS', skyjet: 'Skyjet',
      }
      const avail: Record<string, string> = { 'in-stock': '✅', 'pre-order': '⏳', 'coming-soon': '🔜', discontinued: '❌' }
      return {
        title: `${featured ? '⭐ ' : ''}${title}`,
        subtitle: `${cats[category] ?? category} · €${price?.toLocaleString() ?? '—'} · ${avail[availability] ?? ''}`,
        media,
      }
    },
  },

  orderings: [
    { title: 'Name A–Z', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
    { title: 'Price: Low–High', name: 'priceLow', by: [{ field: 'price', direction: 'asc' }] },
    { title: 'Featured First', name: 'featured', by: [{ field: 'isFeatured', direction: 'desc' }, { field: 'order', direction: 'asc' }] },
  ],
})
