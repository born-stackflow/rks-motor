import { SITE_URL, type Locale } from '@/lib/site'
import type { EnquiryContext } from '@/lib/server/enquiry'
import { esc, renderEmail, subjectSafe, type Row } from './render'

type Labels = Record<string, Record<Locale, string>>

const ENQUIRY_TYPES: Labels = {
  general: { en: 'General information', it: 'Informazioni generali' },
  'test-ride': { en: 'Test ride', it: 'Prova su strada' },
  purchase: { en: 'Purchase', it: 'Acquisto' },
  'after-sales': { en: 'After-sales', it: 'Assistenza post-vendita' },
  availability: { en: 'Availability', it: 'Disponibilità' },
  fitment: { en: 'Fitment', it: 'Compatibilità' },
  other: { en: 'Other', it: 'Altro' },
}

const BUSINESS_TYPES: Labels = {
  dealer: { en: 'Dealer', it: 'Concessionario' },
  distributor: { en: 'Distributor', it: 'Distributore' },
  wholesaler: { en: 'Wholesaler', it: 'Grossista' },
  fleet: { en: 'Fleet operator', it: 'Gestore flotte' },
  importer: { en: 'Importer', it: 'Importatore' },
  other: { en: 'Other', it: 'Altro' },
}

const REFERRAL: Labels = {
  google: { en: 'Google', it: 'Google' },
  'trade-show': { en: 'Trade show', it: 'Fiera' },
  referral: { en: 'Referral', it: 'Passaparola' },
  'social-media': { en: 'Social media', it: 'Social media' },
  other: { en: 'Other', it: 'Altro' },
}

const label = (map: Labels, key: string | undefined, locale: Locale) => (key ? (map[key]?.[locale] ?? key) : undefined)

const COPY = {
  en: {
    received: 'Request received',
    summary: 'Your request',
    message: 'Your message',
    footer: 'You are receiving this email because you submitted a form on our website.',
    models: 'Explore the range',
    dear: (name: string) => `Hi ${esc(name)},`,
  },
  it: {
    received: 'Richiesta ricevuta',
    summary: 'La tua richiesta',
    message: 'Il tuo messaggio',
    footer: 'Ricevi questa email perché hai inviato un modulo dal nostro sito.',
    models: 'Scopri la gamma',
    dear: (name: string) => `Ciao ${esc(name)},`,
  },
}

const TEAM = {
  footer: 'Notifica automatica dal sito. Rispondendo a questa email scrivi direttamente al cliente.',
  open: 'Apri nello Studio',
  reply: 'Rispondi',
  message: 'Messaggio',
  details: 'Dettagli',
}

function customerMail(
  locale: Locale,
  ctx: EnquiryContext,
  parts: { subject: string; heading: string; intro: string; next: string; name: string; rows: Row[]; message?: string },
) {
  const c = COPY[locale]
  return {
    subject: parts.subject,
    html: renderEmail({
      lang: locale,
      preheader: parts.intro,
      eyebrow: c.received,
      heading: parts.heading,
      paragraphs: [c.dear(parts.name), esc(parts.intro), esc(parts.next)],
      rowsTitle: c.summary,
      rows: parts.rows,
      quote: parts.message ? { label: c.message, text: parts.message } : undefined,
      cta: { label: c.models, href: `${SITE_URL}/models` },
      contact: ctx.settings.contact,
      footerNote: c.footer,
    }),
  }
}

function teamMail(
  ctx: EnquiryContext,
  parts: { subject: string; eyebrow: string; heading: string; rows: Row[]; message?: string; replyTo: string },
) {
  return {
    subject: subjectSafe(parts.subject, 120),
    replyTo: parts.replyTo,
    html: renderEmail({
      lang: 'it',
      preheader: parts.heading,
      eyebrow: parts.eyebrow,
      heading: parts.heading,
      paragraphs: [],
      rowsTitle: TEAM.details,
      rows: parts.rows,
      quote: parts.message ? { label: TEAM.message, text: parts.message } : undefined,
      cta: { label: TEAM.open, href: ctx.studioUrl },
      secondaryCta: { label: TEAM.reply, href: `mailto:${parts.replyTo}` },
      footerNote: TEAM.footer,
    }),
  }
}

export type B2CEnquiry = {
  fullName: string
  email: string
  phone: string
  modelInterested?: string
  enquiryType: string
  preferredDealer?: string
  message: string
}

export const b2cEmails = {
  confirmation: (d: B2CEnquiry, ctx: EnquiryContext) => {
    const it = ctx.locale === 'it'
    return customerMail(ctx.locale, ctx, {
      subject: it ? 'Abbiamo ricevuto la tua richiesta — RKS' : 'We received your enquiry — RKS',
      heading: it ? 'Grazie per averci scritto' : 'Thank you for getting in touch',
      intro: it
        ? 'La tua richiesta è arrivata al nostro team.'
        : 'Your enquiry has reached our team.',
      next: it
        ? 'Ti risponderemo il prima possibile all’indirizzo email o al numero che ci hai lasciato.'
        : 'We will get back to you as soon as possible at the email address or phone number you gave us.',
      name: d.fullName,
      rows: [
        [it ? 'Tipo di richiesta' : 'Enquiry type', label(ENQUIRY_TYPES, d.enquiryType, ctx.locale)],
        [it ? 'Modello' : 'Model', d.modelInterested],
        [it ? 'Rivenditore preferito' : 'Preferred dealer', d.preferredDealer],
      ],
      message: d.message,
    })
  },
  notification: (d: B2CEnquiry, ctx: EnquiryContext) =>
    teamMail(ctx, {
      subject: `Nuova richiesta B2C — ${d.modelInterested || label(ENQUIRY_TYPES, d.enquiryType, 'it')} — ${d.fullName}`,
      eyebrow: 'Richiesta cliente (B2C)',
      heading: `${d.fullName} ha inviato una richiesta`,
      rows: [
        ['Nome', d.fullName],
        ['Email', d.email],
        ['Telefono', d.phone],
        ['Tipo', label(ENQUIRY_TYPES, d.enquiryType, 'it')],
        ['Modello', d.modelInterested],
        ['Rivenditore preferito', d.preferredDealer],
        ['Lingua del sito', ctx.locale.toUpperCase()],
      ],
      message: d.message,
      replyTo: d.email,
    }),
}

export type B2BEnquiry = {
  businessName: string
  businessType: string
  vatNumber: string
  address: string
  city: string
  country: string
  contactName: string
  jobTitle: string
  email: string
  phone: string
  whatsapp?: string
  website?: string
  modelsOfInterest: string[]
  estimatedQuantity?: string
  hasShowroom?: boolean
  referralSource?: string
  message?: string
}

export const b2bEmails = {
  confirmation: (d: B2BEnquiry, ctx: EnquiryContext) => {
    const it = ctx.locale === 'it'
    return customerMail(ctx.locale, ctx, {
      subject: it ? 'Candidatura partner ricevuta — RKS' : 'Trade application received — RKS',
      heading: it ? 'Grazie per la tua candidatura' : 'Thank you for your application',
      intro: it
        ? `Abbiamo ricevuto la candidatura di ${d.businessName} come partner commerciale RKS.`
        : `We have received ${d.businessName}'s application to become an RKS trade partner.`,
      next: it
        ? 'Il nostro team commerciale la valuterà e ti contatterà per i prossimi passi.'
        : 'Our sales team will review it and contact you about the next steps.',
      name: d.contactName,
      rows: [
        [it ? 'Azienda' : 'Company', d.businessName],
        [it ? 'Tipo di attività' : 'Business type', label(BUSINESS_TYPES, d.businessType, ctx.locale)],
        [it ? 'Città' : 'City', `${d.city}, ${d.country}`],
        [it ? 'Modelli di interesse' : 'Models of interest', d.modelsOfInterest.join(', ')],
        [it ? 'Quantità stimata' : 'Estimated quantity', d.estimatedQuantity],
      ],
      message: d.message,
    })
  },
  notification: (d: B2BEnquiry, ctx: EnquiryContext) =>
    teamMail(ctx, {
      subject: `Nuova candidatura B2B — ${d.businessName} (${d.city}, ${d.country})`,
      eyebrow: 'Candidatura partner (B2B)',
      heading: `${d.businessName} vuole diventare partner`,
      rows: [
        ['Azienda', d.businessName],
        ['Tipo di attività', label(BUSINESS_TYPES, d.businessType, 'it')],
        ['Partita IVA', d.vatNumber],
        ['Indirizzo', `${d.address}, ${d.city}, ${d.country}`],
        ['Sito web', d.website],
        ['Showroom', d.hasShowroom],
        ['Referente', `${d.contactName} — ${d.jobTitle}`],
        ['Email', d.email],
        ['Telefono', d.phone],
        ['WhatsApp', d.whatsapp],
        ['Modelli di interesse', d.modelsOfInterest.join(', ')],
        ['Quantità stimata', d.estimatedQuantity],
        ['Come ci ha conosciuto', label(REFERRAL, d.referralSource, 'it')],
        ['Lingua del sito', ctx.locale.toUpperCase()],
      ],
      message: d.message,
      replyTo: d.email,
    }),
}

export type PartsEnquiry = {
  name: string
  businessName?: string
  vatNumber?: string
  email: string
  phone: string
  partName: string
  partNumber?: string
  compatibleModel?: string
  bikeYear?: number
  quantityRequired: number
  enquiryType?: string
  isRecurringOrder?: boolean
  monthlyQuantity?: number
  message?: string
}

export const partsEmails = (kind: 'b2c' | 'b2b') => ({
  confirmation: (d: PartsEnquiry, ctx: EnquiryContext) => {
    const it = ctx.locale === 'it'
    return customerMail(ctx.locale, ctx, {
      subject: it ? `Richiesta ricambio ricevuta: ${subjectSafe(d.partName, 50)} — RKS` : `Parts request received: ${subjectSafe(d.partName, 50)} — RKS`,
      heading: it ? 'Abbiamo ricevuto la tua richiesta ricambi' : 'We received your parts request',
      intro: it
        ? 'Il nostro reparto ricambi verificherà disponibilità e compatibilità.'
        : 'Our parts department will check availability and fitment.',
      next: it
        ? 'Ti contatteremo con prezzo e tempi di consegna.'
        : 'We will contact you with pricing and lead time.',
      name: d.name,
      rows: [
        [it ? 'Ricambio' : 'Part', d.partName],
        [it ? 'Codice' : 'Part number', d.partNumber],
        [it ? 'Modello' : 'Model', d.compatibleModel],
        [it ? 'Quantità' : 'Quantity', d.quantityRequired],
      ],
      message: d.message,
    })
  },
  notification: (d: PartsEnquiry, ctx: EnquiryContext) =>
    teamMail(ctx, {
      subject: `Richiesta ricambi ${kind.toUpperCase()} — ${d.partName} ×${d.quantityRequired} — ${d.businessName || d.name}`,
      eyebrow: kind === 'b2b' ? 'Ordine ricambi (B2B)' : 'Richiesta ricambi (B2C)',
      heading: `${d.businessName || d.name} chiede: ${d.partName}`,
      rows: [
        ['Azienda', d.businessName],
        ['Partita IVA', d.vatNumber],
        ['Nome', d.name],
        ['Email', d.email],
        ['Telefono', d.phone],
        ['Ricambio', d.partName],
        ['Codice', d.partNumber],
        ['Modello', d.compatibleModel],
        ['Anno', d.bikeYear],
        ['Quantità', d.quantityRequired],
        ['Tipo', label(ENQUIRY_TYPES, d.enquiryType, 'it')],
        ['Ordine ricorrente', d.isRecurringOrder],
        ['Quantità mensile', d.monthlyQuantity],
        ['Lingua del sito', ctx.locale.toUpperCase()],
      ],
      message: d.message,
      replyTo: d.email,
    }),
})
