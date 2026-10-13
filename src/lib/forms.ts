'use client'

import type { Locale } from './site'

export type SubmitResult =
  | { ok: true }
  | { ok: false; reason: 'invalid'; fields: string[] }
  | { ok: false; reason: 'rate-limited' | 'failed' }

/** Posts a public form to one of the /api routes, adding the site locale and the honeypot field. */
export async function submitForm(
  endpoint: string,
  data: Record<string, unknown>,
  locale: Locale,
  honeypot: string,
): Promise<SubmitResult> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, locale, company_fax: honeypot || undefined }),
    })
    if (response.ok) return { ok: true }
    if (response.status === 429) return { ok: false, reason: 'rate-limited' }
    if (response.status === 400) {
      const body = (await response.json().catch(() => null)) as { fields?: string[] } | null
      return { ok: false, reason: 'invalid', fields: body?.fields ?? [] }
    }
    return { ok: false, reason: 'failed' }
  } catch {
    return { ok: false, reason: 'failed' }
  }
}

export const FORM_MESSAGES = {
  en: {
    invalid: 'Please check the highlighted fields.',
    rateLimited: 'Too many attempts. Please wait a few minutes and try again.',
    failed: 'Something went wrong while sending. Please try again or email us.',
    sending: 'Sending…',
    required: 'Required',
    consent: 'I agree to the processing of my personal data to handle this request.',
  },
  it: {
    invalid: 'Controlla i campi evidenziati.',
    rateLimited: 'Troppi tentativi. Attendi qualche minuto e riprova.',
    failed: 'Qualcosa è andato storto durante l’invio. Riprova o scrivici via email.',
    sending: 'Invio in corso…',
    required: 'Obbligatorio',
    consent: 'Acconsento al trattamento dei miei dati personali per gestire questa richiesta.',
  },
} satisfies Record<Locale, Record<string, string>>
