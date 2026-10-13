import 'server-only'
import { Document, Page, StyleSheet, Text, View, renderToBuffer } from '@react-pdf/renderer'
import { SITE_URL } from '@/lib/site'
import type { ContactDetails } from './notifications'

export type InvoiceOrder = {
  orderNumber?: string
  orderType?: 'b2c' | 'b2b'
  orderDate?: string
  invoiceNumber?: string
  invoiceDate?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  agreedPrice?: number
  depositAmount?: number
  paymentStatus?: 'unpaid' | 'deposit-paid' | 'fully-paid' | 'refunded'
  modelName?: string
  quantity?: number
  notes?: string
}

const RED = '#cc0000'
const INK = '#0a0a0a'
const MUTED = '#6b7280'

const s = StyleSheet.create({
  page: { padding: 48, fontFamily: 'Helvetica', fontSize: 10, color: INK },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  brand: { fontSize: 24, fontFamily: 'Helvetica-Bold', letterSpacing: 3 },
  brandSub: { fontSize: 8, color: MUTED, marginTop: 3, letterSpacing: 2 },
  invoiceLabel: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: RED, textAlign: 'right', letterSpacing: 2 },
  invoiceRef: { fontSize: 10, textAlign: 'right', marginTop: 4 },
  divider: { borderBottomWidth: 2, borderBottomColor: RED, marginBottom: 20 },
  thinLine: { borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb', marginVertical: 16 },
  twoCol: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  col: { width: '48%' },
  label: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#9ca3af', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.8 },
  name: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  info: { fontSize: 9, color: '#374151', marginBottom: 2 },
  tableHead: { flexDirection: 'row', backgroundColor: INK, padding: '9 12' },
  tableHeadText: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: '#ffffff' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb', padding: '9 12' },
  cDesc: { width: '50%' },
  cQty: { width: '15%', textAlign: 'center' },
  cUnit: { width: '17.5%', textAlign: 'right' },
  cTotal: { width: '17.5%', textAlign: 'right' },
  totalsWrap: { alignItems: 'flex-end', marginTop: 14 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', width: '42%', marginBottom: 5 },
  totalLbl: { fontSize: 9, color: MUTED },
  totalVal: { fontSize: 9 },
  outstandingRow: { flexDirection: 'row', justifyContent: 'space-between', width: '42%', backgroundColor: INK, padding: '9 12', marginTop: 6 },
  outstandingText: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
  badge: { alignSelf: 'flex-end', paddingHorizontal: 10, paddingVertical: 4, marginTop: 10 },
  badgeText: { fontSize: 8, fontFamily: 'Helvetica-Bold' },
  notes: { fontSize: 9, color: MUTED, lineHeight: 1.5 },
  footer: { position: 'absolute', bottom: 30, left: 48, right: 48 },
  footerLine: { borderTopWidth: 1, borderTopColor: RED, marginBottom: 7 },
  footerText: { fontSize: 7.5, color: '#9ca3af', textAlign: 'center', lineHeight: 1.6 },
})

const PAYMENT_BADGES = {
  unpaid: { bg: '#fef2f2', color: '#b91c1c', label: 'UNPAID' },
  'deposit-paid': { bg: '#fefce8', color: '#a16207', label: 'DEPOSIT PAID' },
  'fully-paid': { bg: '#f0fdf4', color: '#15803d', label: 'PAID IN FULL' },
  refunded: { bg: '#eff6ff', color: '#1d4ed8', label: 'REFUNDED' },
} as const

const eur = (amount: number) =>
  `€ ${amount.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

function fmtDate(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
}

export function invoiceReference(order: InvoiceOrder) {
  return order.invoiceNumber || order.orderNumber || 'invoice'
}

function InvoiceDocument({ order, contact }: { order: InvoiceOrder; contact: ContactDetails }) {
  const unit = Number(order.agreedPrice ?? 0)
  const quantity = Number(order.quantity ?? 1)
  const total = unit * quantity
  const deposit = Number(order.depositAmount ?? 0)
  const badge = PAYMENT_BADGES[order.paymentStatus ?? 'unpaid'] ?? PAYMENT_BADGES.unpaid
  const footer = [new URL(SITE_URL).host, contact.email, contact.phone].filter(Boolean).join('  •  ')

  return (
    <Document title={`Invoice ${invoiceReference(order)}`} author="RKS">
      <Page size="A4" style={s.page}>
        <View style={s.headerRow}>
          <View>
            <Text style={s.brand}>RKS</Text>
            <Text style={s.brandSub}>E-BIKES & PARTS</Text>
          </View>
          <View>
            <Text style={s.invoiceLabel}>INVOICE</Text>
            {order.invoiceNumber ? <Text style={s.invoiceRef}>{order.invoiceNumber}</Text> : null}
          </View>
        </View>
        <View style={s.divider} />

        <View style={s.twoCol}>
          <View style={s.col}>
            <Text style={s.label}>Bill to</Text>
            <Text style={s.name}>{order.customerName || '—'}</Text>
            {order.customerEmail ? <Text style={s.info}>{order.customerEmail}</Text> : null}
            {order.customerPhone ? <Text style={s.info}>{order.customerPhone}</Text> : null}
          </View>
          <View style={{ ...s.col, alignItems: 'flex-end' }}>
            <Text style={s.label}>Invoice date</Text>
            <Text style={s.info}>{fmtDate(order.invoiceDate || order.orderDate)}</Text>
            <Text style={{ ...s.label, marginTop: 10 }}>Order number</Text>
            <Text style={s.info}>{order.orderNumber || '—'}</Text>
            <Text style={{ ...s.label, marginTop: 10 }}>Order type</Text>
            <Text style={s.info}>{order.orderType === 'b2b' ? 'B2B — Trade' : 'B2C — Retail'}</Text>
          </View>
        </View>

        <View style={s.tableHead}>
          <Text style={{ ...s.tableHeadText, ...s.cDesc }}>Description</Text>
          <Text style={{ ...s.tableHeadText, ...s.cQty }}>Qty</Text>
          <Text style={{ ...s.tableHeadText, ...s.cUnit }}>Unit price</Text>
          <Text style={{ ...s.tableHeadText, ...s.cTotal }}>Total</Text>
        </View>
        <View style={s.tableRow}>
          <Text style={s.cDesc}>{order.modelName || 'E-bike'}</Text>
          <Text style={s.cQty}>{quantity}</Text>
          <Text style={s.cUnit}>{eur(unit)}</Text>
          <Text style={s.cTotal}>{eur(total)}</Text>
        </View>

        <View style={s.totalsWrap}>
          <View style={s.totalRow}>
            <Text style={s.totalLbl}>Subtotal</Text>
            <Text style={s.totalVal}>{eur(total)}</Text>
          </View>
          {deposit > 0 ? (
            <View style={s.totalRow}>
              <Text style={s.totalLbl}>Deposit paid</Text>
              <Text style={{ ...s.totalVal, color: '#15803d' }}>− {eur(deposit)}</Text>
            </View>
          ) : null}
          <View style={s.outstandingRow}>
            <Text style={s.outstandingText}>Balance due</Text>
            <Text style={s.outstandingText}>{eur(Math.max(total - deposit, 0))}</Text>
          </View>
          <View style={{ ...s.badge, backgroundColor: badge.bg }}>
            <Text style={{ ...s.badgeText, color: badge.color }}>{badge.label}</Text>
          </View>
        </View>

        {order.notes ? (
          <>
            <View style={s.thinLine} />
            <Text style={s.label}>Notes</Text>
            <Text style={s.notes}>{order.notes}</Text>
          </>
        ) : null}

        <View style={s.footer} fixed>
          <View style={s.footerLine} />
          <Text style={s.footerText}>{footer}</Text>
          <Text style={s.footerText}>This invoice was generated electronically and is valid without a signature.</Text>
        </View>
      </Page>
    </Document>
  )
}

export function renderInvoice(order: InvoiceOrder, contact: ContactDetails) {
  return renderToBuffer(<InvoiceDocument order={order} contact={contact} />)
}
