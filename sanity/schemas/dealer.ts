import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'dealer',
  title: 'Dealers & Service Centres',
  type: 'document',

  groups: [
    { name: 'info', title: 'Info', default: true },
    { name: 'location', title: 'Location' },
    { name: 'services', title: 'Services & Hours' },
  ],

  fields: [
    // ── Info ──────────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'info',
      validation: (R) => R.required().min(2),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'info',
      options: { source: 'name', maxLength: 96 },
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      group: 'info',
      options: {
        list: [
          { title: 'Dealer', value: 'dealer' },
          { title: 'Service Centre', value: 'service' },
          { title: 'Dealer & Service Centre', value: 'both' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Dealer Logo',
      type: 'image',
      group: 'info',
      options: { hotspot: true },
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      group: 'info',
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'email',
      group: 'info',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
      group: 'info',
    }),
    defineField({
      name: 'languages',
      title: 'Languages Spoken',
      type: 'array',
      group: 'info',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'English', value: 'en' },
          { title: 'Italian', value: 'it' },
          { title: 'French', value: 'fr' },
          { title: 'German', value: 'de' },
          { title: 'Spanish', value: 'es' },
          { title: 'Arabic', value: 'ar' },
        ],
        layout: 'tags',
      },
    }),
    defineField({
      name: 'isActive',
      title: 'Active / Visible on site',
      type: 'boolean',
      group: 'info',
      initialValue: true,
    }),

    // ── Location ──────────────────────────────────────────────────
    defineField({
      name: 'address',
      title: 'Street Address',
      type: 'text',
      group: 'location',
      rows: 2,
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      group: 'location',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'region',
      title: 'Region / State',
      type: 'string',
      group: 'location',
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      group: 'location',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'latitude',
      title: 'Latitude',
      type: 'number',
      group: 'location',
      validation: (R) => R.required().min(-90).max(90),
    }),
    defineField({
      name: 'longitude',
      title: 'Longitude',
      type: 'number',
      group: 'location',
      validation: (R) => R.required().min(-180).max(180),
    }),
    defineField({
      name: 'googleMapsUrl',
      title: 'Google Maps URL',
      type: 'url',
      group: 'location',
    }),

    // ── Services & Hours ───────────────────────────────────────────
    defineField({
      name: 'services',
      title: 'Services Offered',
      type: 'array',
      group: 'services',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Sales', value: 'sales' },
          { title: 'Servicing & Maintenance', value: 'servicing' },
          { title: 'Parts & Accessories', value: 'parts' },
          { title: 'Test Rides', value: 'test-rides' },
          { title: 'Finance', value: 'finance' },
          { title: 'Warranty Repairs', value: 'warranty' },
        ],
        layout: 'tags',
      },
    }),
    defineField({
      name: 'hours',
      title: 'Opening Hours',
      type: 'text',
      group: 'services',
      rows: 4,
      description: 'e.g. Mon–Fri: 9:00–18:00, Sat: 9:00–13:00',
    }),
  ],

  preview: {
    select: {
      title: 'name',
      city: 'city',
      country: 'country',
      type: 'type',
      active: 'isActive',
    },
    prepare({ title, city, country, type, active }: Record<string, any>) {
      const typeLabel: Record<string, string> = { dealer: '🏍️', service: '🔧', both: '🏍️🔧' }
      return {
        title: `${active === false ? '🔴 ' : ''}${typeLabel[type] ?? ''} ${title}`,
        subtitle: `${city ?? ''}, ${country ?? ''}`,
      }
    },
  },

  orderings: [
    { title: 'Name A–Z', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
    { title: 'Country A–Z', name: 'countryAsc', by: [{ field: 'country', direction: 'asc' }, { field: 'city', direction: 'asc' }] },
  ],
})
