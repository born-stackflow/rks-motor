import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'bikePart',
  title: 'E-Bike Parts & Accessories',
  type: 'document',

  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'specs', title: 'Specifications' },
    { name: 'compatibility', title: 'Compatibility' },
    { name: 'pricing', title: 'Pricing & Stock' },
    { name: 'seo', title: 'SEO' },
  ],

  fields: [
    // ── Identity ──────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Part Name',
      type: 'string',
      group: 'content',
      validation: (R) => R.required().min(2).max(120),
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
      name: 'partNumber',
      title: 'OEM Part Number',
      type: 'string',
      group: 'content',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'manufacturerPartNumber',
      title: 'Manufacturer Part Number',
      type: 'string',
      group: 'content',
      description: 'Cross-reference part number',
    }),
    defineField({
      name: 'replacesPartNumber',
      title: 'Replaces Part Number',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Motor & Drive System', value: 'motor' },
          { title: 'Battery & Charging',   value: 'battery' },
          { title: 'Brakes',               value: 'brakes' },
          { title: 'Suspension & Steering', value: 'suspension' },
          { title: 'Electrical & Lighting', value: 'electrical' },
          { title: 'Gears & Drivetrain',   value: 'gears' },
          { title: 'Body & Frame',         value: 'body' },
          { title: 'Tyres & Wheels',       value: 'tyres' },
          { title: 'Accessories',          value: 'accessories' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'partType',
      title: 'Part Type',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'OEM (Original)', value: 'oem' },
          { title: 'Aftermarket Compatible', value: 'aftermarket' },
          { title: 'Accessory', value: 'accessory' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
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
    }),
    defineField({
      name: 'images',
      title: 'Part Images',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
          ],
        },
      ],
    }),

    // ── Package ────────────────────────────────────────────────────
    defineField({
      name: 'soldAs',
      title: 'Sold As',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Single', value: 'single' },
          { title: 'Pair', value: 'pair' },
          { title: 'Kit', value: 'kit' },
          { title: 'Set', value: 'set' },
        ],
        layout: 'radio',
      },
      initialValue: 'single',
    }),
    defineField({
      name: 'quantityInPackage',
      title: 'Quantity in Package',
      type: 'number',
      group: 'content',
      initialValue: 1,
      validation: (R) => R.min(1),
    }),
    defineField({
      name: 'packageIncludes',
      title: 'Package Includes',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'warranty',
      title: 'Warranty',
      type: 'string',
      group: 'content',
    }),

    // ── Specifications ─────────────────────────────────────────────
    defineField({
      name: 'material',
      title: 'Material',
      type: 'string',
      group: 'specs',
    }),
    defineField({
      name: 'surfaceFinish',
      title: 'Surface Finish',
      type: 'string',
      group: 'specs',
    }),
    defineField({
      name: 'coating',
      title: 'Coating',
      type: 'string',
      group: 'specs',
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions & Weight',
      type: 'object',
      group: 'specs',
      fields: [
        defineField({ name: 'length', title: 'Length (mm)', type: 'number' }),
        defineField({ name: 'width', title: 'Width (mm)', type: 'number' }),
        defineField({ name: 'height', title: 'Height/Depth (mm)', type: 'number' }),
        defineField({ name: 'weight', title: 'Weight (grams)', type: 'number' }),
        defineField({ name: 'boreDiameter', title: 'Bore Diameter (mm)', type: 'number' }),
        defineField({ name: 'stroke', title: 'Stroke (mm)', type: 'number' }),
      ],
    }),
    defineField({
      name: 'technicalSpecs',
      title: 'Technical Specifications',
      type: 'object',
      group: 'specs',
      fields: [
        defineField({ name: 'operatingTempMin', title: 'Operating Temp Min (°C)', type: 'number' }),
        defineField({ name: 'operatingTempMax', title: 'Operating Temp Max (°C)', type: 'number' }),
        defineField({ name: 'pressureRating', title: 'Pressure Rating (bar)', type: 'number' }),
        defineField({ name: 'voltage', title: 'Voltage (V)', type: 'number' }),
        defineField({ name: 'wattage', title: 'Wattage (W)', type: 'number' }),
        defineField({ name: 'amperage', title: 'Amperage (A)', type: 'number' }),
        defineField({ name: 'threadSize', title: 'Thread Size', type: 'string' }),
        defineField({ name: 'torqueSpec', title: 'Torque Specification (Nm)', type: 'number' }),
        defineField({ name: 'oilCompatibility', title: 'Oil Compatibility', type: 'string' }),
        defineField({ name: 'brakeFluidCompatibility', title: 'Brake Fluid Compatibility', type: 'string' }),
        defineField({ name: 'padThickness', title: 'Pad Thickness (mm)', type: 'number' }),
        defineField({ name: 'wearLimitThickness', title: 'Wear Limit Thickness (mm)', type: 'number' }),
        defineField({ name: 'chainPitch', title: 'Chain Pitch', type: 'string' }),
        defineField({ name: 'sprocketTeeth', title: 'Sprocket Teeth Count', type: 'number' }),
        defineField({ name: 'springRate', title: 'Spring Rate (N/mm)', type: 'number' }),
        defineField({ name: 'tyreSizeFitment', title: 'Tyre Size Fitment', type: 'string' }),
        defineField({ name: 'ipRating', title: 'IP Rating', type: 'string' }),
        defineField({ name: 'lumenOutput', title: 'Lumen Output', type: 'number' }),
        defineField({ name: 'colourTemperature', title: 'Colour Temperature (K)', type: 'number' }),
        defineField({ name: 'beamType', title: 'Beam Type', type: 'string' }),
      ],
    }),

    // ── Compatibility ──────────────────────────────────────────────
    defineField({
      name: 'compatibleModels',
      title: 'Compatible Models',
      type: 'array',
      group: 'compatibility',
      of: [{ type: 'reference', to: [{ type: 'bikeModel' }] }],
    }),
    defineField({
      name: 'yearRangeFrom',
      title: 'Year Range From',
      type: 'number',
      group: 'compatibility',
      validation: (R) => R.min(1900).max(2100),
    }),
    defineField({
      name: 'yearRangeTo',
      title: 'Year Range To',
      type: 'number',
      group: 'compatibility',
      validation: (R) => R.min(1900).max(2100),
    }),
    defineField({
      name: 'fitmentNotes',
      title: 'Fitment Notes',
      type: 'text',
      group: 'compatibility',
      rows: 3,
    }),

    // ── Pricing & Stock ────────────────────────────────────────────
    defineField({
      name: 'retailPrice',
      title: 'Retail Price (€)',
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
          { title: 'Order Required', value: 'order-required' },
          { title: 'Out of Stock', value: 'out-of-stock' },
        ],
        layout: 'radio',
      },
      initialValue: 'in-stock',
    }),
    defineField({
      name: 'leadTime',
      title: 'Lead Time',
      type: 'string',
      group: 'pricing',
      description: 'e.g. "3–5 business days"',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Part',
      type: 'boolean',
      group: 'pricing',
      initialValue: false,
    }),

    // ── SEO ────────────────────────────────────────────────────────
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
      description: 'Defaults to part name if left blank',
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
      partNumber: 'partNumber',
      category: 'category',
      availability: 'availability',
      featured: 'isFeatured',
      media: 'images.0',
    },
    prepare({ title, partNumber, category, availability, featured, media }: Record<string, any>) {
      const avail: Record<string, string> = { 'in-stock': '✅', 'order-required': '📋', 'out-of-stock': '❌' }
      return {
        title: `${featured ? '⭐ ' : ''}${title}`,
        subtitle: `${partNumber ?? '—'} · ${category ?? ''} ${avail[availability] ?? ''}`,
        media,
      }
    },
  },

  orderings: [
    { title: 'Name A–Z', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
    { title: 'Price: Low–High', name: 'priceLow', by: [{ field: 'retailPrice', direction: 'asc' }] },
    { title: 'Part Number', name: 'partNumberAsc', by: [{ field: 'partNumber', direction: 'asc' }] },
  ],
})
