import { NextRequest, NextResponse } from 'next/server'
import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from '@react-pdf/renderer'
import { sanityWriteClient, resend, FROM } from '@/lib/sanity.server'
import { z } from 'zod'

const bodySchema = z.object({
  orderId: z.string().min(1),
  sendEmail: z.boolean().optional().default(true),
})

// ── PDF Styles ────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page:           { padding: 48, fontFamily: 'Helvetica', fontSize: 10, color: '#111827' },

  // Header
  headerRow:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  brandName:      { fontSize: 20, fontFamily: 'Helvetica-Bold', color: '#1d3557' },
  brandSub:       { fontSize: 8, color: '#6b7280', marginTop: 3 },
  invoiceLabel:   { fontSize: 20, fontFamily: 'Helvetica-Bold', color: '#e63946', textAlign: 'right' },
  invoiceRef:     { fontSize: 10, color: '#374151', textAlign: 'right', marginTop: 4 },

  divider:        { borderBottomWidth: 2, borderBottomColor: '#1d3557', marginBottom: 20 },
  thinLine:       { borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb', marginVertical: 16 },

  // Two-column info block
  twoCol:         { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  col:            { width: '48%' },
  sectionLabel:   { fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#9ca3af', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.8 },
  infoName:       { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#111827', marginBottom: 2 },
  infoText:       { fontSize: 9, color: '#374151', marginBottom: 2 },
  infoTextMuted:  { fontSize: 9, color: '#6b7280', marginTop: 4 },

  // Line items table
  tableHead:      { flexDirection: 'row', backgroundColor: '#1d3557', padding: '9 12', borderRadius: 3, marginBottom: 0 },
  tableHeadText:  { fontFamily: 'Helvetica-Bold', fontSize: 8, color: '#ffffff' },
  tableRow:       { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#f3f4f6', padding: '9 12' },
  tableRowAlt:    { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#f3f4f6', padding: '9 12', backgroundColor: '#f9fafb' },
  cDesc:          { width: '50%' },
  cQty:           { width: '15%', textAlign: 'center' },
  cUnit:          { width: '17.5%', textAlign: 'right' },
  cTotal:         { width: '17.5%', textAlign: 'right' },

  // Totals block
  totalsWrap:     { alignItems: 'flex-end', marginTop: 14 },
  totalRow:       { flexDirection: 'row', justifyContent: 'space-between', width: '42%', marginBottom: 5 },
  totalLbl:       { fontSize: 9, color: '#6b7280' },
  totalVal:       { fontSize: 9, color: '#374151' },
  totalValGreen:  { fontSize: 9, color: '#16a34a' },
  outstandingRow: { flexDirection: 'row', justifyContent: 'space-between', width: '42%', backgroundColor: '#1d3557', padding: '9 12', borderRadius: 3, marginTop: 6 },
  outstandingLbl: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
  outstandingVal: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ffffff' },

  // Payment badge
  badge:          { alignSelf: 'flex-end', borderRadius: 4, paddingHorizontal: 10, paddingVertical: 4, marginTop: 10 },
  badgeText:      { fontSize: 8, fontFamily: 'Helvetica-Bold' },

  // Notes
  notesLabel:     { fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#9ca3af', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 },
  notesText:      { fontSize: 9, color: '#6b7280', lineHeight: 1.5 },

  // Footer
  footer:         { position: 'absolute', bottom: 30, left: 48, right: 48 },
  footerLine:     { borderTopWidth: 1, borderTopColor: '#e63946', marginBottom: 7 },
  footerText:     { fontSize: 7.5, color: '#9ca3af', textAlign: 'center', lineHeight: 1.6 },
})

// ── Helpers ───────────────────────────────────────────────────────────────────
function eur(amount: number) {
  return `€${Number(amount || 0).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function fmtDate(d?: string) {
  if (!d) return '—'
  try { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) }
  catch { return d }
}

const PAYMENT_BADGES: Record<string, { bg: string; color: string; label: string }> = {
  'unpaid':       { bg: '#fef2f2', color: '#dc2626', label: 'UNPAID' },
  'deposit-paid': { bg: '#fefce8', color: '#ca8a04', label: 'DEPOSIT PAID' },
  'fully-paid':   { bg: '#f0fdf4', color: '#16a34a', label: 'FULLY PAID' },
  'refunded':     { bg: '#eff6ff', color: '#2563eb', label: 'REFUNDED' },
}

// ── PDF Template ──────────────────────────────────────────────────────────────
function InvoicePDF({ order }: { order: Record<string, any> }) {
  const agreedPrice = Number(order.agreedPrice ?? 0)
  const quantity    = Number(order.quantity ?? 1)
  const lineTotal   = agreedPrice * quantity
  const deposit     = Number(order.depositAmount ?? 0)
  const outstanding = Math.max(lineTotal - deposit, 0)
  const badge       = PAYMENT_BADGES[order.paymentStatus] ?? PAYMENT_BADGES['unpaid']

  return (
    <Document
      title={`Invoice ${order.invoiceNumber || order.orderNumber || ''}`}
      author="RKS Motorcycles"
    >
      <Page size="A4" style={s.page}>

        {/* ── Header ── */}
        <View style={s.headerRow}>
          <View>
            <Text style={s.brandName}>RKS MOTORCYCLES</Text>
            <Text style={s.brandSub}>Premium Italian Motorcycles</Text>
          </View>
          <View>
            <Text style={s.invoiceLabel}>INVOICE</Text>
            {order.invoiceNumber && <Text style={s.invoiceRef}>{order.invoiceNumber}</Text>}
          </View>
        </View>

        <View style={s.divider} />

        {/* ── Bill To / Invoice Details ── */}
        <View style={s.twoCol}>
          <View style={s.col}>
            <Text style={s.sectionLabel}>Bill To</Text>
            <Text style={s.infoName}>{order.customerName || '—'}</Text>
            {order.customerEmail && <Text style={s.infoText}>{order.customerEmail}</Text>}
            {order.customerPhone && <Text style={s.infoText}>{order.customerPhone}</Text>}
            {order.deliveryAddress && <Text style={s.infoTextMuted}>{order.deliveryAddress}</Text>}
          </View>
          <View style={{ ...s.col, alignItems: 'flex-end' }}>
            <Text style={s.sectionLabel}>Invoice Date</Text>
            <Text style={s.infoText}>{fmtDate(order.invoiceDate || order.orderDate)}</Text>
            <Text style={{ ...s.sectionLabel, marginTop: 10 }}>Order Number</Text>
            <Text style={s.infoText}>{order.orderNumber || '—'}</Text>
            <Text style={{ ...s.sectionLabel, marginTop: 10 }}>Order Type</Text>
            <Text style={s.infoText}>
              {order.orderType === 'b2b' ? 'B2B — Trade / Dealer' : 'B2C — Retail Customer'}
            </Text>
          </View>
        </View>

        {/* ── Line Items ── */}
        <View style={s.tableHead}>
          <Text style={{ ...s.tableHeadText, ...s.cDesc }}>Description</Text>
          <Text style={{ ...s.tableHeadText, ...s.cQty }}>Qty</Text>
          <Text style={{ ...s.tableHeadText, ...s.cUnit }}>Unit Price</Text>
          <Text style={{ ...s.tableHeadText, ...s.cTotal }}>Total</Text>
        </View>

        <View style={s.tableRow}>
          <Text style={s.cDesc}>{order.modelName || 'Motorcycle'}</Text>
          <Text style={s.cQty}>{quantity}</Text>
          <Text style={s.cUnit}>{eur(agreedPrice)}</Text>
          <Text style={s.cTotal}>{eur(lineTotal)}</Text>
        </View>

        {/* ── Totals ── */}
        <View style={s.totalsWrap}>
          <View style={s.totalRow}>
            <Text style={s.totalLbl}>Subtotal</Text>
            <Text style={s.totalVal}>{eur(lineTotal)}</Text>
          </View>
          {deposit > 0 && (
            <View style={s.totalRow}>
              <Text style={s.totalLbl}>Deposit Paid</Text>
              <Text style={s.totalValGreen}>− {eur(deposit)}</Text>
            </View>
          )}
          <View style={s.outstandingRow}>
            <Text style={s.outstandingLbl}>Outstanding Balance</Text>
            <Text style={s.outstandingVal}>{eur(outstanding)}</Text>
          </View>
          <View style={{ ...s.badge, backgroundColor: badge.bg }}>
            <Text style={{ ...s.badgeText, color: badge.color }}>{badge.label}</Text>
          </View>
        </View>

        {/* ── Notes ── */}
        {order.notes && (
          <>
            <View style={s.thinLine} />
            <Text style={s.notesLabel}>Notes</Text>
            <Text style={s.notesText}>{order.notes}</Text>
          </>
        )}

        {/* ── Footer ── */}
        <View style={s.footer}>
          <View style={s.footerLine} />
          <Text style={s.footerText}>
            RKS Motorcycles  •  info@rks-motorcycles.com  •  www.rks-motorcycles.com
          </Text>
          <Text style={s.footerText}>
            This invoice was generated electronically and is valid without a physical signature.
          </Text>
        </View>

      </Page>
    </Document>
  )
}

// ── Route Handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }
  const { orderId, sendEmail } = parsed.data

  const order = await sanityWriteClient.fetch<Record<string, any>>(
    `*[_type == "order" && _id == $id][0]{
      orderNumber, orderType, orderDate, invoiceNumber, invoiceDate,
      customerName, customerEmail, customerPhone, deliveryAddress,
      agreedPrice, depositAmount, paymentStatus, status,
      "modelName": model->name,
      quantity, notes
    }`,
    { id: orderId }
  )

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const pdfBuffer = await renderToBuffer(<InvoicePDF order={order} />)

  if (sendEmail && order.customerEmail) {
    const ref = order.invoiceNumber || order.orderNumber || 'Invoice'
    await resend.emails.send({
      from: FROM,
      to: order.customerEmail as string,
      subject: `Your Invoice — RKS Motorcycles (${ref})`,
      html: `
        <p>Dear ${order.customerName || 'Customer'},</p>
        <p>Thank you for your order with RKS Motorcycles. Please find your invoice attached to this email.</p>
        <p>If you have any questions regarding this invoice, please contact us at
           <a href="mailto:info@rks-motorcycles.com">info@rks-motorcycles.com</a>.</p>
        <br />
        <p>Best regards,<br />RKS Motorcycles Team</p>
      `,
      attachments: [
        {
          filename: `${ref}.pdf`,
          content: Buffer.from(pdfBuffer).toString('base64'),
        },
      ],
    })
  }

  const invoiceFilename = `${order.invoiceNumber || order.orderNumber || 'invoice'}.pdf`
  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${invoiceFilename}"`,
    },
  })
}
