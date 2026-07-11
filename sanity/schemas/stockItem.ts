import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'stockItem',
  title: 'Stock / Inventory',
  type: 'document',

  fields: [
    defineField({
      name: 'model',
      title: 'Bike Model',
      type: 'reference',
      to: [{ type: 'bikeModel' }],
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'colour',
      title: 'Colour / Variant',
      type: 'string',
    }),
    defineField({
      name: 'quantity',
      title: 'Current Stock',
      type: 'number',
      validation: (R) => R.required().min(0),
      initialValue: 0,
    }),
    defineField({
      name: 'lowStockAlert',
      title: 'Low Stock Alert Threshold',
      type: 'number',
      initialValue: 3,
      description: 'Highlight in CMS when stock drops to or below this number',
    }),
    defineField({
      name: 'location',
      title: 'Storage Location',
      type: 'string',
      description: 'e.g. Main Warehouse, Showroom Floor, Dealer Yard',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 3,
    }),
  ],

  preview: {
    select: {
      model: 'model.name',
      colour: 'colour',
      quantity: 'quantity',
      threshold: 'lowStockAlert',
      location: 'location',
    },
    prepare({ model, colour, quantity, threshold, location }: Record<string, any>) {
      const low = quantity <= (threshold ?? 3)
      return {
        title: `${low ? '⚠️ ' : ''}${model ?? 'Unknown Model'}${colour ? ` — ${colour}` : ''}`,
        subtitle: `Stock: ${quantity} · ${location ?? 'Main'}`,
      }
    },
  },

  orderings: [
    { title: 'Model A–Z', name: 'modelAsc', by: [{ field: 'model.name', direction: 'asc' }] },
    { title: 'Low Stock First', name: 'lowStock', by: [{ field: 'quantity', direction: 'asc' }] },
  ],
})
