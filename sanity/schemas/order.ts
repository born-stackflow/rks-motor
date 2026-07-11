import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'order',
  title: 'Orders',
  type: 'document',

  groups: [
    { name: 'details', title: 'Order Details', default: true },
    { name: 'customer', title: 'Customer' },
    { name: 'payment', title: 'Payment' },
    { name: 'internal', title: 'Internal' },
  ],

  fields: [
    // ── Order Identity ────────────────────────────────────────────
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      group: 'details',
      validation: (R) => R.required(),
      description: 'e.g. ORD-2024-001',
    }),
    defineField({
      name: 'orderType',
      title: 'Order Type',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { title: 'B2C — Retail Customer', value: 'b2c' },
          { title: 'B2B — Trade / Dealer', value: 'b2b' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'model',
      title: 'Bike Model',
      type: 'reference',
      to: [{ type: 'bikeModel' }],
      group: 'details',
    }),
    defineField({
      name: 'quantity',
      title: 'Quantity',
      type: 'number',
      group: 'details',
      initialValue: 1,
      validation: (R) => R.min(1),
    }),
    defineField({
      name: 'agreedPrice',
      title: 'Agreed Price (€)',
      type: 'number',
      group: 'details',
    }),
    defineField({
      name: 'orderDate',
      title: 'Order Date',
      type: 'datetime',
      group: 'details',
    }),
    defineField({
      name: 'expectedDelivery',
      title: 'Expected Delivery Date',
      type: 'date',
      group: 'details',
    }),
    defineField({
      name: 'deliveryAddress',
      title: 'Delivery Address',
      type: 'text',
      group: 'details',
      rows: 3,
    }),
    defineField({
      name: 'status',
      title: 'Order Status',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { title: '⏳ Pending', value: 'pending' },
          { title: '✅ Confirmed', value: 'confirmed' },
          { title: '🏭 In Production', value: 'in-production' },
          { title: '📦 Ready for Collection', value: 'ready' },
          { title: '🚚 Delivered', value: 'delivered' },
          { title: '❌ Cancelled', value: 'cancelled' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),

    // ── Customer ──────────────────────────────────────────────────
    defineField({
      name: 'customerName',
      title: 'Customer / Business Name',
      type: 'string',
      group: 'customer',
    }),
    defineField({
      name: 'customerEmail',
      title: 'Email',
      type: 'string',
      group: 'customer',
    }),
    defineField({
      name: 'customerPhone',
      title: 'Phone',
      type: 'string',
      group: 'customer',
    }),
    defineField({
      name: 'linkedEnquiry',
      title: 'Linked B2C Enquiry',
      type: 'reference',
      to: [{ type: 'b2cEnquiry' }],
      group: 'customer',
    }),
    defineField({
      name: 'linkedB2BEnquiry',
      title: 'Linked B2B Enquiry',
      type: 'reference',
      to: [{ type: 'b2bEnquiry' }],
      group: 'customer',
    }),

    // ── Payment ───────────────────────────────────────────────────
    defineField({
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      group: 'payment',
      options: {
        list: [
          { title: '🔴 Unpaid', value: 'unpaid' },
          { title: '🟡 Deposit Paid', value: 'deposit-paid' },
          { title: '🟢 Fully Paid', value: 'fully-paid' },
          { title: '↩️ Refunded', value: 'refunded' },
        ],
        layout: 'radio',
      },
      initialValue: 'unpaid',
    }),
    defineField({
      name: 'depositAmount',
      title: 'Deposit Amount (€)',
      type: 'number',
      group: 'payment',
    }),
    defineField({
      name: 'invoiceNumber',
      title: 'Invoice Number',
      type: 'string',
      group: 'payment',
      description: 'e.g. INV-2024-001',
    }),
    defineField({
      name: 'invoiceDate',
      title: 'Invoice Date',
      type: 'date',
      group: 'payment',
    }),
    defineField({
      name: 'invoicePDF',
      title: 'Invoice PDF',
      type: 'file',
      group: 'payment',
      options: { accept: '.pdf' },
      description: 'Upload the signed invoice PDF here for record-keeping',
    }),

    // ── Internal ──────────────────────────────────────────────────
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      group: 'internal',
      rows: 4,
    }),
  ],

  preview: {
    select: {
      orderNumber: 'orderNumber',
      customer: 'customerName',
      status: 'status',
      model: 'model.name',
    },
    prepare({ orderNumber, customer, status, model }: Record<string, any>) {
      const icons: Record<string, string> = {
        pending: '⏳', confirmed: '✅', 'in-production': '🏭',
        ready: '📦', delivered: '🚚', cancelled: '❌',
      }
      return {
        title: `${icons[status] ?? ''} #${orderNumber} — ${customer ?? 'Unknown'}`,
        subtitle: model ?? '',
      }
    },
  },

  orderings: [
    { title: 'Newest First', name: 'orderDateDesc', by: [{ field: 'orderDate', direction: 'desc' }] },
    { title: 'Status', name: 'byStatus', by: [{ field: 'status', direction: 'asc' }] },
  ],
})
