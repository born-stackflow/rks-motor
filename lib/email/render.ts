import { SITE_URL } from '@/lib/site'
import type { ContactDetails } from '@/lib/server/notifications'

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export function esc(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch])
}

/** Escapes user text and keeps its line breaks. */
export function escMultiline(value: unknown): string {
  return esc(value).replace(/\r?\n/g, '<br>')
}

/** Header values must stay on one line and within a sane length. */
export function subjectSafe(value: unknown, max = 80): string {
  const flat = String(value ?? '').replace(/[\r\n\t]+/g, ' ').trim()
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat
}

export type Row = [label: string, value: string | number | boolean | null | undefined]

export type EmailContent = {
  lang: 'en' | 'it'
  preheader: string
  eyebrow: string
  heading: string
  /** Trusted HTML paragraphs: interpolate user data only through esc(). */
  paragraphs: string[]
  rowsTitle?: string
  rows?: Row[]
  quote?: { label: string; text: string }
  cta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  contact?: ContactDetails
  footerNote: string
}

const C = {
  black: '#0a0a0a',
  dark: '#141414',
  border: '#262626',
  red: '#cc0000',
  text: '#f5f5f5',
  muted: '#a3a3a3',
}

function renderRows(rows: Row[]) {
  return rows
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([label, value]) => {
      const shown = typeof value === 'boolean' ? (value ? '✓' : '—') : escMultiline(value)
      return `<tr>
  <td style="padding:10px 12px;border-bottom:1px solid ${C.border};color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:1px;width:38%;vertical-align:top">${esc(label)}</td>
  <td style="padding:10px 12px;border-bottom:1px solid ${C.border};color:${C.text};font-size:14px;vertical-align:top">${shown}</td>
</tr>`
    })
    .join('')
}

function button(cta: { label: string; href: string }, primary: boolean) {
  const bg = primary ? C.red : 'transparent'
  const border = primary ? C.red : C.muted
  return `<a href="${esc(cta.href)}" style="display:inline-block;background:${bg};border:1px solid ${border};color:#ffffff;text-decoration:none;padding:12px 26px;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:4px">${esc(cta.label)}</a>`
}

export function renderEmail(content: EmailContent): string {
  const contactBits = [content.contact?.phone, content.contact?.email, content.contact?.address]
    .filter(Boolean)
    .map(esc)
    .join(' · ')

  return `<!DOCTYPE html>
<html lang="${content.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<title>${esc(content.heading)}</title>
</head>
<body style="margin:0;padding:0;background:${C.black};font-family:Inter,Arial,Helvetica,sans-serif">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(content.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.black}">
<tr><td align="center" style="padding:32px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${C.dark};border:1px solid ${C.border}">
  <tr><td style="padding:28px 32px;border-bottom:3px solid ${C.red}">
    <span style="font-size:28px;font-weight:800;letter-spacing:4px;color:#ffffff">RKS</span>
    <span style="font-size:11px;letter-spacing:3px;color:${C.muted};text-transform:uppercase;margin-left:10px">E-Bikes</span>
  </td></tr>
  <tr><td style="padding:32px">
    <p style="margin:0 0 8px;color:${C.red};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase">${esc(content.eyebrow)}</p>
    <h1 style="margin:0 0 20px;color:#ffffff;font-size:24px;line-height:1.25">${esc(content.heading)}</h1>
    ${content.paragraphs.map((p) => `<p style="margin:0 0 14px;color:${C.text};font-size:15px;line-height:1.6">${p}</p>`).join('')}
    ${
      content.rows?.length
        ? `${content.rowsTitle ? `<p style="margin:24px 0 8px;color:${C.muted};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase">${esc(content.rowsTitle)}</p>` : ''}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${C.border};margin-bottom:8px">${renderRows(content.rows)}</table>`
        : ''
    }
    ${
      content.quote?.text
        ? `<p style="margin:24px 0 8px;color:${C.muted};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase">${esc(content.quote.label)}</p>
    <div style="border-left:3px solid ${C.red};padding:12px 16px;background:${C.black};color:${C.text};font-size:14px;line-height:1.6">${escMultiline(content.quote.text)}</div>`
        : ''
    }
    ${
      content.cta || content.secondaryCta
        ? `<div style="margin-top:28px;text-align:center">${content.cta ? button(content.cta, true) : ''}${content.secondaryCta ? button(content.secondaryCta, false) : ''}</div>`
        : ''
    }
  </td></tr>
  <tr><td style="padding:22px 32px;border-top:1px solid ${C.border};color:${C.muted};font-size:12px;line-height:1.6">
    <a href="${esc(SITE_URL)}" style="color:#ffffff;text-decoration:none;font-weight:700">${esc(new URL(SITE_URL).host)}</a>
    ${contactBits ? `<br>${contactBits}` : ''}
    <br>${esc(content.footerNote)}
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}
