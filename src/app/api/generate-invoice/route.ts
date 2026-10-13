import { timingSafeEqual } from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { getWriteClient } from '@/lib/server/sanity-write'
import { sendMail } from '@/lib/server/mail'
import { getNotificationSettings } from '@/lib/server/notifications'
import { invoiceReference, renderInvoice, type InvoiceOrder } from '@/lib/server/invoice-pdf'
import { esc, renderEmail } from '@/lib/email/render'

export const runtime = 'nodejs'

const bodySchema = z.object({
  orderId: z.string().min(1).max(200),
  sendEmail: z.boolean().default(false),
})

/** Internal endpoint: requires `Authorization: Bearer <INVOICE_API_SECRET>` and is disabled when the secret is unset. */
function isAuthorized(request: NextRequest, secret: string) {
  const header = request.headers.get('authorization') ?? ''
  const given = Buffer.from(header.replace(/^Bearer\s+/i, ''))
  const expected = Buffer.from(secret)
  return given.length === expected.length && timingSafeEqual(given, expected)
}

export async function POST(request: NextRequest) {
  const secret = process.env.INVOICE_API_SECRET
  if (!secret) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!isAuthorized(request, secret)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  const { orderId, sendEmail } = parsed.data

  try {
    const order = await getWriteClient().fetch<InvoiceOrder | null>(
      `*[_type == "order" && _id == $id][0]{
        orderNumber, orderType, orderDate, invoiceNumber, invoiceDate,
        customerName, customerEmail, customerPhone,
        agreedPrice, depositAmount, paymentStatus, quantity, notes,
        "modelName": model->name
      }`,
      { id: orderId },
    )
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    const { contact } = await getNotificationSettings()
    const pdf = await renderInvoice(order, contact)
    const reference = invoiceReference(order)

    let emailed = false
    if (sendEmail && order.customerEmail) {
      emailed = await sendMail({
        to: order.customerEmail,
        subject: `Your invoice ${reference} — RKS`,
        html: renderEmail({
          lang: 'en',
          preheader: `Invoice ${reference}`,
          eyebrow: 'Invoice',
          heading: `Invoice ${reference}`,
          paragraphs: [
            `Dear ${esc(order.customerName || 'customer')},`,
            'thank you for your order. Your invoice is attached to this email.',
          ],
          contact,
          footerNote: 'For any question about this invoice, reply to this email.',
        }),
        attachments: [{ filename: `${reference}.pdf`, content: Buffer.from(pdf) }],
      })
    }

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${reference.replace(/[^\w.-]+/g, '_')}.pdf"`,
        'X-Invoice-Emailed': String(emailed),
      },
    })
  } catch (err) {
    console.error('[generate-invoice]', err)
    return NextResponse.json({ error: 'Invoice generation failed' }, { status: 500 })
  }
}
