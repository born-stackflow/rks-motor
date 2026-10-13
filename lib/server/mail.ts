import 'server-only'
import { Resend } from 'resend'

let resend: Resend | null = null

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not configured')
  resend ??= new Resend(key)
  return resend
}

export const MAIL_FROM = process.env.RESEND_FROM_EMAIL || 'RKS <noreply@rksitalia.it>'

export type MailMessage = {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
  attachments?: Array<{ filename: string; content: Buffer }>
}

/** Sends one email. Resend reports failures in the result instead of throwing, so both paths are checked. */
export async function sendMail(message: MailMessage): Promise<boolean> {
  try {
    const { error } = await getResend().emails.send({ from: MAIL_FROM, ...message })
    if (error) {
      console.error('[mail] rejected by Resend', { subject: message.subject, error })
      return false
    }
    return true
  } catch (err) {
    console.error('[mail] send failed', { subject: message.subject, err })
    return false
  }
}

/** Adds a newsletter subscriber to a Resend segment. */
export async function addToSegment(segmentId: string, email: string): Promise<boolean> {
  try {
    const { error } = await getResend().contacts.create({ email, segments: [{ id: segmentId }] })
    if (error) {
      console.error('[mail] could not add contact', error)
      return false
    }
    return true
  } catch (err) {
    console.error('[mail] could not add contact', err)
    return false
  }
}
