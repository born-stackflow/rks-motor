'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  Phone, Mail, MapPin, Clock, ArrowRight,
  Zap, Wrench, ShoppingCart, Headphones, Send, CheckCircle, Info,
} from '@/components/ui/Icon'
import { sanityClient, queries, urlFor } from '@/lib/sanity'
import type { SiteSettings } from '@/lib/sanity'

// ── Enquiry types (must match API schema) ─────────────────────────────────────
const ENQUIRY_TYPES = [
  { value: 'general',    label: 'General',    desc: 'Any question',     Icon: Mail        },
  { value: 'test-ride',  label: 'Test Ride',  desc: 'Book a session',   Icon: Zap         },
  { value: 'purchase',   label: 'Purchase',   desc: 'Buy an e-bike',    Icon: ShoppingCart},
  { value: 'after-sales',label: 'After Sales',desc: 'Support & warranty',Icon: Headphones  },
  { value: 'other',      label: 'Other',      desc: 'Something else',   Icon: Info        },
] as const

type EnquiryValue = typeof ENQUIRY_TYPES[number]['value']

interface FormData {
  fullName: string
  email: string
  phone: string
  modelInterested: string
  enquiryType: EnquiryValue
  message: string
  gdprConsent: boolean
}

const EMPTY: FormData = {
  fullName: '', email: '', phone: '', modelInterested: '',
  enquiryType: 'general', message: '', gdprConsent: false,
}

// ── Animation variants ────────────────────────────────────────────────────────
const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]
const slideUp: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}
const slideRight: Variants = {
  hidden:  { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
}

// ── Floating particle ─────────────────────────────────────────────────────────
function Particle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-red/40 pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{ y: [0, -20, 0], opacity: [0.2, 0.7, 0.2] }}
      transition={{ duration: 3 + delay, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  )
}

// ── Animated input field ──────────────────────────────────────────────────────
function Field({
  label, required, error, children,
}: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <motion.div variants={slideUp} className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-mid">
        {label}{required && <span className="text-red ml-1">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-red"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function ContactPage() {
  const [form, setForm]           = useState<FormData>(EMPTY)
  const [errors, setErrors]       = useState<Partial<Record<keyof FormData, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [apiError, setApiError]     = useState('')
  const [models, setModels]         = useState<{ name: string; slug: string }[]>([])
  const [settings, setSettings]     = useState<SiteSettings | null>(null)

  useEffect(() => {
    sanityClient.fetch(queries.navModels).then((d: any[]) =>
      setModels((d ?? []).map(m => ({ name: m.name, slug: m.slug })))
    )
    sanityClient.fetch(queries.siteSettings).then((d: SiteSettings) => setSettings(d ?? null))
  }, [])

  const set = (field: keyof FormData, val: string | boolean) =>
    setForm(p => ({ ...p, [field]: val }))

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.fullName.trim())        e.fullName    = 'Full name is required'
    if (!form.email.includes('@'))    e.email       = 'Valid email required'
    if (!form.phone.trim())           e.phone       = 'Phone number is required'
    if (form.message.trim().length < 10) e.message  = 'Message must be at least 10 characters'
    if (!form.gdprConsent)            e.gdprConsent = 'You must accept the privacy policy'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    if (!validate()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/enquiry-b2c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, submittedAt: new Date().toISOString() }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      setApiError('Something went wrong. Please try again or email us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  const contactInfo = [
    {
      Icon: MapPin, label: 'Head Office',
      value: settings?.address ?? 'Via dell\'Innovazione 42, 20142 Milano MI, Italy',
    },
    {
      Icon: Phone, label: 'Phone',
      value: settings?.phone ?? '+39 02 1234 5678',
      href: `tel:${(settings?.phone ?? '+390212345678').replace(/\s/g, '')}`,
    },
    {
      Icon: Mail, label: 'Email',
      value: settings?.email ?? 'info@rks-ebikes.com',
      href: `mailto:${settings?.email ?? 'info@rks-ebikes.com'}`,
    },
    {
      Icon: Clock, label: 'Office Hours',
      value: 'Mon – Fri: 9:00 – 18:00 CET',
    },
  ]

  return (
    <div className="min-h-screen bg-black">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative h-[42vh] min-h-[280px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1920&q=90"
          alt="Contact RKS E-Bikes"
          fill priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/95" />

        {/* Floating particles */}
        {[[15,30],[25,60],[45,20],[65,70],[80,40],[90,55]].map(([x,y],i) => (
          <Particle key={i} x={x} y={y} delay={i * 0.5} />
        ))}

        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-red text-xs font-semibold uppercase tracking-[0.3em] mb-3">
                Get in Touch
              </p>
              <h1
                className="text-off-white leading-none mb-3"
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 'clamp(3rem, 8vw, 7rem)',
                  letterSpacing: '0.02em',
                }}
              >
                Contact <span className="text-red">Us</span>
              </h1>
              <motion.div
                className="h-[3px] bg-red"
                initial={{ width: 0 }}
                animate={{ width: 60 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-12 xl:gap-20">

          {/* ── Left sidebar ────────────────────────────────────── */}
          <motion.div
            className="space-y-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={slideRight}>
              <p className="text-red text-xs font-semibold uppercase tracking-[0.25em] mb-2">
                Reach Us
              </p>
              <h2
                className="text-off-white text-4xl leading-none mb-4"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                We'd Love to Hear From You
              </h2>
              <p className="text-light text-sm leading-relaxed">
                Whether you're looking to test ride, purchase, or just learn more about our
                e-bikes — our team responds within one business day.
              </p>
            </motion.div>

            {/* Contact info cards */}
            {contactInfo.map(({ Icon, label, value, href }, i) => (
              <motion.div
                key={i}
                variants={slideRight}
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="flex items-start gap-4 p-4 bg-dark border border-dark-3 hover:border-red/40 transition-colors group"
              >
                <div className="w-10 h-10 bg-red/10 border border-red/20 group-hover:bg-red/20 flex items-center justify-center shrink-0 transition-colors">
                  <Icon className="h-4 w-4 text-red" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-mid mb-0.5">
                    {label}
                  </p>
                  {href ? (
                    <a href={href} className="text-off-white text-sm hover:text-red transition-colors">
                      {value}
                    </a>
                  ) : (
                    <p className="text-off-white text-sm">{value}</p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Map card */}
            <motion.div
              variants={slideRight}
              className="relative aspect-[4/3] overflow-hidden bg-dark border border-dark-3"
            >
              <Image
                src="https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80"
                alt="Milan, Italy"
                fill
                className="object-cover opacity-25"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <motion.div
                  className="w-5 h-5 bg-red rounded-full"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <p className="text-off-white text-sm font-bold">RKS E-Bikes HQ</p>
                <p className="text-mid text-xs">Milan, Italy</p>
                <a
                  href="https://maps.google.com/?q=Via+dell+Innovazione+42+Milan+Italy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-xs text-red hover:text-red/70 font-semibold uppercase tracking-wider transition-colors"
                >
                  Open in Maps →
                </a>
              </div>
            </motion.div>

            {/* Dealer CTA */}
            <motion.div variants={slideRight} className="p-5 bg-dark-2 border-l-4 border-red">
              <p className="text-xs font-semibold uppercase tracking-wider text-red mb-1.5">
                Local Support
              </p>
              <p className="text-off-white font-bold text-sm mb-1">
                Looking for a dealer near you?
              </p>
              <p className="text-light text-xs mb-4 leading-relaxed">
                50+ authorised dealers offer test rides, genuine parts, and full service across Europe.
              </p>
              <Link
                href="/dealers"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-off-white border border-dark-3 hover:border-red hover:text-red px-4 py-2 transition-all"
              >
                Find a Dealer <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* ── Form ────────────────────────────────────────────── */}
          <div>
            <AnimatePresence mode="wait">

              {/* Success state */}
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full flex flex-col items-center justify-center text-center py-20 border border-green-500/20 bg-dark"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
                    className="w-20 h-20 bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-6"
                  >
                    <CheckCircle className="h-10 w-10 text-green-400" />
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="text-4xl text-off-white mb-3"
                    style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                  >
                    Message Sent
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="text-light text-sm leading-relaxed max-w-sm mb-8"
                  >
                    Thank you for reaching out. An RKS specialist will respond within 24 hours.
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    onClick={() => { setSubmitted(false); setForm(EMPTY) }}
                    className="btn-secondary"
                  >
                    Send Another Message
                  </motion.button>
                </motion.div>
              ) : (

                /* Form */
                <motion.div
                  key="form"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={stagger}
                >
                  <motion.div variants={slideUp} className="mb-8">
                    <p className="text-red text-xs font-semibold uppercase tracking-[0.25em] mb-2">
                      Enquiry Form
                    </p>
                    <h2
                      className="text-off-white text-4xl leading-none"
                      style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                    >
                      Send a Message
                    </h2>
                  </motion.div>

                  {/* Enquiry type selector */}
                  <motion.div variants={slideUp} className="mb-8">
                    <p className="text-xs font-semibold uppercase tracking-wider text-mid mb-3">
                      What can we help you with?
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {ENQUIRY_TYPES.map(({ value, label, desc, Icon }) => {
                        const active = form.enquiryType === value
                        return (
                          <motion.button
                            key={value}
                            type="button"
                            onClick={() => set('enquiryType', value)}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className={`relative flex flex-col items-center gap-2 p-3 border text-center transition-all duration-200 ${
                              active
                                ? 'border-red bg-red/10 text-off-white'
                                : 'border-dark-3 bg-dark hover:border-red/50 text-mid hover:text-light'
                            }`}
                          >
                            {active && (
                              <motion.div
                                layoutId="type-bg"
                                className="absolute inset-0 bg-red/5"
                              />
                            )}
                            <Icon className={`h-5 w-5 relative z-10 ${active ? 'text-red' : ''}`} />
                            <span className="text-xs font-bold uppercase tracking-wide relative z-10">
                              {label}
                            </span>
                            <span className="text-[10px] text-mid leading-tight relative z-10 hidden sm:block">
                              {desc}
                            </span>
                            {active && (
                              <motion.div
                                layoutId="type-dot"
                                className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red"
                              />
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                  </motion.div>

                  <form onSubmit={handleSubmit} noValidate>
                    <motion.div variants={stagger} className="space-y-5">

                      {/* Name + Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Field label="Full Name" required error={errors.fullName as string}>
                          <input
                            type="text"
                            placeholder="Your full name"
                            value={form.fullName}
                            onChange={e => set('fullName', e.target.value)}
                            className={`input transition-all focus:border-red ${errors.fullName ? 'border-red' : ''}`}
                          />
                        </Field>
                        <Field label="Email Address" required error={errors.email as string}>
                          <input
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={e => set('email', e.target.value)}
                            className={`input transition-all focus:border-red ${errors.email ? 'border-red' : ''}`}
                          />
                        </Field>
                      </div>

                      {/* Phone + Model */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Field label="Phone Number" required error={errors.phone as string}>
                          <input
                            type="tel"
                            placeholder="+39 02 ..."
                            value={form.phone}
                            onChange={e => set('phone', e.target.value)}
                            className={`input transition-all focus:border-red ${errors.phone ? 'border-red' : ''}`}
                          />
                        </Field>
                        <Field label="E-Bike Model (optional)">
                          <select
                            value={form.modelInterested}
                            onChange={e => set('modelInterested', e.target.value)}
                            className="select"
                          >
                            <option value="">Not model-specific</option>
                            {models.map(m => (
                              <option key={m.slug} value={m.name}>{m.name}</option>
                            ))}
                          </select>
                        </Field>
                      </div>

                      {/* Message */}
                      <Field label="Message" required error={errors.message as string}>
                        <textarea
                          placeholder="Tell us more about your enquiry..."
                          value={form.message}
                          onChange={e => set('message', e.target.value)}
                          rows={5}
                          className={`input resize-none transition-all focus:border-red ${errors.message ? 'border-red' : ''}`}
                        />
                        <p className="text-xs text-mid text-right -mt-1">
                          {form.message.length} / 10 min
                        </p>
                      </Field>

                      {/* GDPR */}
                      <motion.div variants={slideUp}>
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <motion.button
                            type="button"
                            onClick={() => set('gdprConsent', !form.gdprConsent)}
                            whileTap={{ scale: 0.9 }}
                            className={`shrink-0 w-5 h-5 mt-0.5 border-2 flex items-center justify-center transition-all ${
                              form.gdprConsent
                                ? 'border-red bg-red'
                                : 'border-dark-3 group-hover:border-red/60'
                            }`}
                          >
                            <AnimatePresence>
                              {form.gdprConsent && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  className="w-2.5 h-2.5 bg-white block"
                                />
                              )}
                            </AnimatePresence>
                          </motion.button>
                          <span className="text-xs text-light leading-relaxed">
                            I agree to the{' '}
                            <Link href="/privacy" className="text-red hover:text-red/70 underline">
                              Privacy Policy
                            </Link>
                            {' '}and consent to RKS processing my data to respond to this enquiry.{' '}
                            <span className="text-red">*</span>
                          </span>
                        </label>
                        <AnimatePresence>
                          {errors.gdprConsent && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="text-xs text-red mt-1.5"
                            >
                              {errors.gdprConsent as string}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* API error */}
                      <AnimatePresence>
                        {apiError && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="p-4 bg-red/10 border border-red/30 text-red text-sm"
                          >
                            {apiError}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Submit */}
                      <motion.div variants={slideUp}>
                        <motion.button
                          type="submit"
                          disabled={submitting}
                          whileHover={{ scale: submitting ? 1 : 1.01 }}
                          whileTap={{ scale: submitting ? 1 : 0.98 }}
                          className={`btn-primary w-full justify-center gap-3 py-4 text-sm ${
                            submitting ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
                        >
                          {submitting ? (
                            <>
                              <motion.span
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full block"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                              />
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Message
                              <Send className="h-4 w-4" />
                            </>
                          )}
                        </motion.button>
                      </motion.div>

                    </motion.div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
