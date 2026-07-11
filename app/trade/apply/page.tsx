'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  ArrowRight, ChevronLeft, Check, CheckCircle, Building2,
  Globe, Package, Truck, Info, Send, Zap,
} from '@/components/ui/Icon'
import { sanityClient, queries } from '@/lib/sanity'
import type { SiteSettings } from '@/lib/sanity'

// ── Options aligned to API enums ──────────────────────────────────────────────
const BUSINESS_TYPES = [
  { value: 'dealer',      label: 'Dealer',      desc: 'Retail / showroom',  Icon: Building2 },
  { value: 'distributor', label: 'Distributor',  desc: 'Regional dist.',     Icon: Globe     },
  { value: 'wholesaler',  label: 'Wholesaler',   desc: 'Bulk supply',        Icon: Package   },
  { value: 'fleet',       label: 'Fleet Buyer',  desc: '5+ units',           Icon: Truck     },
  { value: 'importer',    label: 'Importer',     desc: 'Import / export',    Icon: Zap       },
  { value: 'other',       label: 'Other',        desc: 'Tell us more',       Icon: Info      },
] as const

type BusinessType = typeof BUSINESS_TYPES[number]['value']

const QUANTITIES = [
  { value: '1-5',   label: '1–5',   sub: 'units / year' },
  { value: '6-15',  label: '6–15',  sub: 'units / year' },
  { value: '16-30', label: '16–30', sub: 'units / year' },
  { value: '30+',   label: '30+',   sub: 'units / year' },
] as const

type Quantity = typeof QUANTITIES[number]['value']

const REFERRAL_SOURCES = [
  { value: 'google',      label: 'Search Engine' },
  { value: 'trade-show',  label: 'Trade Show'    },
  { value: 'referral',    label: 'Referral'      },
  { value: 'social-media',label: 'Social Media'  },
  { value: 'other',       label: 'Other'         },
] as const

type ReferralSource = typeof REFERRAL_SOURCES[number]['value']

interface FormData {
  businessName: string; businessType: BusinessType | ''; vatNumber: string
  address: string; city: string; country: string; website: string
  contactName: string; jobTitle: string; email: string; phone: string; whatsapp: string
  modelsOfInterest: string[]; estimatedQuantity: Quantity | ''
  hasShowroom: boolean | null; referralSource: ReferralSource | ''; message: string
  gdprConsent: boolean
}

const EMPTY: FormData = {
  businessName: '', businessType: '', vatNumber: '',
  address: '', city: '', country: '', website: '',
  contactName: '', jobTitle: '', email: '', phone: '', whatsapp: '',
  modelsOfInterest: [], estimatedQuantity: '',
  hasShowroom: null, referralSource: '', message: '',
  gdprConsent: false,
}

// ── Animation variants ────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]
const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}
const slideUp: Variants = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

function SectionTitle({ num, title }: { num: string; title: string }) {
  return (
    <motion.h2
      variants={slideUp}
      className="text-2xl text-off-white mb-6 pb-3 border-b border-dark-3 flex items-center gap-3"
      style={{ fontFamily: 'Bebas Neue, sans-serif' }}
    >
      <span className="w-8 h-8 bg-red text-white text-sm flex items-center justify-center shrink-0">
        {num}
      </span>
      {title}
    </motion.h2>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <motion.div variants={slideUp} className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-mid">
        {label}{required && <span className="text-red ml-1">*</span>}
      </label>
      {children}
    </motion.div>
  )
}

const STEPS = ['Business', 'Contact', 'Models', 'Details']

export default function TradeApplyPage() {
  const [form, setForm]           = useState<FormData>(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const [apiError,   setApiError]   = useState('')
  const [models,     setModels]     = useState<{ name: string; slug: string }[]>([])
  const [settings,   setSettings]   = useState<SiteSettings | null>(null)

  useEffect(() => {
    sanityClient.fetch(queries.navModels).then((d: any[]) =>
      setModels((d ?? []).map((m: any) => ({ name: m.name, slug: m.slug })))
    )
    sanityClient.fetch(queries.siteSettings).then((d: SiteSettings) => setSettings(d ?? null))
  }, [])

  const set = <K extends keyof FormData>(field: K, val: FormData[K]) =>
    setForm(p => ({ ...p, [field]: val }))

  const toggleModel = (name: string) =>
    setForm(p => ({
      ...p,
      modelsOfInterest: p.modelsOfInterest.includes(name)
        ? p.modelsOfInterest.filter(m => m !== name)
        : [...p.modelsOfInterest, name],
    }))

  // Simple section-completion progress for the progress bar
  const progress = [
    !!(form.businessName && form.businessType && form.country),
    !!(form.contactName && form.email),
    form.modelsOfInterest.length > 0,
    !!(form.gdprConsent),
  ].filter(Boolean).length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    if (!form.gdprConsent) { setApiError('You must accept the privacy policy.'); return }
    if (!form.businessName || !form.businessType || !form.country || !form.contactName || !form.email) {
      setApiError('Please complete all required fields.'); return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/enquiry-b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          hasShowroom: form.hasShowroom ?? false,
          estimatedQuantity: form.estimatedQuantity || undefined,
          referralSource: form.referralSource || undefined,
          submittedAt: new Date().toISOString(),
        }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.error ?? 'Submission failed')
      }
      setSubmitted(true)
    } catch (err: any) {
      setApiError(err.message ?? 'Something went wrong. Please email us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  const tradeEmail = settings?.tradeEmail ?? 'trade@rks-ebikes.com'

  return (
    <div className="min-h-screen bg-black">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative h-[36vh] min-h-[220px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1920&q=90"
          alt="Apply as Trade Partner"
          fill priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/95" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href="/trade" className="inline-flex items-center gap-1 text-xs text-light hover:text-red transition-colors mb-4">
                <ChevronLeft className="h-3 w-3" /> Back to Trade Partners
              </Link>
              <p className="text-red text-xs font-semibold uppercase tracking-[0.3em] mb-3">
                Trade Application
              </p>
              <h1
                className="text-off-white leading-none mb-3"
                style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', letterSpacing: '0.02em' }}
              >
                Apply as <span className="text-red">Trade Partner</span>
              </h1>
              <motion.div
                className="h-[3px] bg-red"
                initial={{ width: 0 }}
                animate={{ width: 60 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Progress bar ────────────────────────────────────────── */}
      <div className="bg-dark border-b border-dark-3 sticky top-0 z-10">
        <div className="container py-3 flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1 flex-1">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-1 flex-1">
                <div className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${i < progress ? 'text-red' : 'text-mid'}`}>
                  <span className={`w-5 h-5 border flex items-center justify-center text-[10px] transition-all ${i < progress ? 'border-red bg-red text-white' : 'border-dark-3'}`}>
                    {i < progress ? '✓' : i + 1}
                  </span>
                  {step}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-2 transition-colors ${i < progress - 1 ? 'bg-red/50' : 'bg-dark-3'}`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-mid sm:ml-auto">
            <span className="text-off-white font-bold">{progress}</span> / {STEPS.length} sections complete
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">

          {/* ── Form / Success ───────────────────────────────────── */}
          <div>
            <AnimatePresence mode="wait">

              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="py-20 flex flex-col items-center text-center border border-green-500/20 bg-dark"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    className="w-20 h-20 bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-6"
                  >
                    <CheckCircle className="h-10 w-10 text-green-400" />
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl text-off-white mb-3"
                    style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                  >
                    Application Submitted
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-light text-sm max-w-md leading-relaxed mb-8"
                  >
                    Thank you, <strong className="text-off-white">{form.contactName}</strong>.
                    Our trade team will review your application and respond within 3–5 business days.
                    Check your inbox for a confirmation email.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link href="/trade" className="btn-secondary inline-flex items-center gap-2">
                      <ChevronLeft className="h-4 w-4" /> Back to Trade Partners
                    </Link>
                  </motion.div>
                </motion.div>

              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-12"
                  initial="hidden"
                  animate="visible"
                  variants={stagger}
                >

                  {/* ── 01 Business ───────────────────────────────── */}
                  <motion.div variants={stagger}>
                    <SectionTitle num="01" title="Business Information" />

                    {/* Business type cards */}
                    <motion.div variants={slideUp} className="mb-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-mid mb-3">
                        Business Type <span className="text-red">*</span>
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {BUSINESS_TYPES.map(({ value, label, desc, Icon }) => {
                          const active = form.businessType === value
                          return (
                            <motion.button
                              key={value}
                              type="button"
                              onClick={() => set('businessType', value)}
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.97 }}
                              className={`relative flex flex-col items-center gap-2 p-4 border text-center transition-all ${
                                active ? 'border-red bg-red/10 text-off-white' : 'border-dark-3 bg-dark hover:border-red/50 text-mid hover:text-light'
                              }`}
                            >
                              <Icon className={`h-5 w-5 ${active ? 'text-red' : ''}`} />
                              <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
                              <span className="text-[10px] text-mid">{desc}</span>
                              {active && (
                                <motion.div
                                  layoutId="btype"
                                  className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red"
                                />
                              )}
                            </motion.button>
                          )
                        })}
                      </div>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="Business / Company Name" required>
                        <input type="text" placeholder="Your business name" value={form.businessName}
                          onChange={e => set('businessName', e.target.value)}
                          className="input focus:border-red transition-all" required />
                      </Field>
                      <Field label="VAT / Company Reg. No." required>
                        <input type="text" placeholder="IT12345678" value={form.vatNumber}
                          onChange={e => set('vatNumber', e.target.value)}
                          className="input focus:border-red transition-all" required />
                      </Field>
                      <Field label="Street Address" required>
                        <input type="text" placeholder="Street address" value={form.address}
                          onChange={e => set('address', e.target.value)}
                          className="input focus:border-red transition-all" required />
                      </Field>
                      <Field label="City" required>
                        <input type="text" placeholder="City" value={form.city}
                          onChange={e => set('city', e.target.value)}
                          className="input focus:border-red transition-all" required />
                      </Field>
                      <Field label="Country" required>
                        <input type="text" placeholder="Country" value={form.country}
                          onChange={e => set('country', e.target.value)}
                          className="input focus:border-red transition-all" required />
                      </Field>
                      <Field label="Website">
                        <input type="url" placeholder="https://yourbusiness.com" value={form.website}
                          onChange={e => set('website', e.target.value)}
                          className="input focus:border-red transition-all" />
                      </Field>

                      {/* Showroom toggle */}
                      <Field label="Do You Have a Showroom?">
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { val: true,  label: 'Yes' },
                            { val: false, label: 'No'  },
                          ].map(({ val, label }) => (
                            <button
                              key={label}
                              type="button"
                              onClick={() => set('hasShowroom', val)}
                              className={`py-2.5 text-xs font-bold uppercase tracking-wider border transition-all ${
                                form.hasShowroom === val ? 'border-red bg-red/10 text-red' : 'border-dark-3 text-mid hover:border-red/50'
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </Field>
                    </div>
                  </motion.div>

                  {/* ── 02 Contact ────────────────────────────────── */}
                  <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <SectionTitle num="02" title="Contact Person" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="Full Name" required>
                        <input type="text" placeholder="First Last" value={form.contactName}
                          onChange={e => set('contactName', e.target.value)}
                          className="input focus:border-red transition-all" required />
                      </Field>
                      <Field label="Job Title" required>
                        <input type="text" placeholder="e.g. Owner, Sales Manager" value={form.jobTitle}
                          onChange={e => set('jobTitle', e.target.value)}
                          className="input focus:border-red transition-all" required />
                      </Field>
                      <Field label="Email Address" required>
                        <input type="email" placeholder="you@business.com" value={form.email}
                          onChange={e => set('email', e.target.value)}
                          className="input focus:border-red transition-all" required />
                      </Field>
                      <Field label="Phone" required>
                        <input type="tel" placeholder="+39 ..." value={form.phone}
                          onChange={e => set('phone', e.target.value)}
                          className="input focus:border-red transition-all" required />
                      </Field>
                      <Field label="WhatsApp (optional)">
                        <input type="tel" placeholder="+39 ..." value={form.whatsapp}
                          onChange={e => set('whatsapp', e.target.value)}
                          className="input focus:border-red transition-all" />
                      </Field>
                    </div>
                  </motion.div>

                  {/* ── 03 Models ─────────────────────────────────── */}
                  <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <SectionTitle num="03" title="E-Bike Models of Interest" />
                    <motion.p variants={slideUp} className="text-light text-sm mb-5">
                      Select all models you intend to stock or distribute:
                    </motion.p>

                    {models.length === 0 ? (
                      <motion.p variants={slideUp} className="text-mid text-sm italic">
                        Loading models from CMS…
                      </motion.p>
                    ) : (
                      <motion.div variants={slideUp} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                        {models.map(model => {
                          const selected = form.modelsOfInterest.includes(model.name)
                          return (
                            <motion.label
                              key={model.slug}
                              whileHover={{ x: 3 }}
                              className={`flex items-center gap-3 p-4 border cursor-pointer transition-all ${
                                selected ? 'border-red bg-red/10' : 'border-dark-3 hover:border-red/50'
                              }`}
                            >
                              <motion.button
                                type="button"
                                onClick={() => toggleModel(model.name)}
                                whileTap={{ scale: 0.85 }}
                                className={`shrink-0 w-5 h-5 border-2 flex items-center justify-center transition-all ${
                                  selected ? 'border-red bg-red' : 'border-dark-3'
                                }`}
                              >
                                <AnimatePresence>
                                  {selected && (
                                    <motion.span
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      exit={{ scale: 0 }}
                                    >
                                      <Check className="h-3 w-3 text-white" />
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </motion.button>
                              <span className={`text-sm font-medium transition-colors ${selected ? 'text-off-white' : 'text-light'}`}>
                                {model.name}
                              </span>
                            </motion.label>
                          )
                        })}
                      </motion.div>
                    )}

                    {/* Quantity selector */}
                    <motion.div variants={slideUp}>
                      <p className="text-xs font-semibold uppercase tracking-wider text-mid mb-3">
                        Estimated Annual Order Volume
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {QUANTITIES.map(q => (
                          <motion.button
                            key={q.value}
                            type="button"
                            onClick={() => set('estimatedQuantity', q.value)}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.96 }}
                            className={`flex flex-col items-center py-4 border transition-all ${
                              form.estimatedQuantity === q.value
                                ? 'border-red bg-red/10 text-off-white'
                                : 'border-dark-3 text-mid hover:border-red/50 hover:text-light'
                            }`}
                          >
                            <span className={`text-xl font-bold ${form.estimatedQuantity === q.value ? 'text-red' : ''}`}
                              style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                              {q.label}
                            </span>
                            <span className="text-[10px] text-mid mt-0.5">{q.sub}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* ── 04 Additional ─────────────────────────────── */}
                  <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <SectionTitle num="04" title="Additional Information" />
                    <div className="space-y-5">
                      <Field label="How Did You Hear About Us?">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {REFERRAL_SOURCES.map(r => (
                            <button
                              key={r.value}
                              type="button"
                              onClick={() => set('referralSource', r.value)}
                              className={`py-2.5 px-3 text-xs font-semibold uppercase tracking-wider border transition-all ${
                                form.referralSource === r.value
                                  ? 'border-red bg-red/10 text-red'
                                  : 'border-dark-3 text-mid hover:border-red/50 hover:text-light'
                              }`}
                            >
                              {r.label}
                            </button>
                          ))}
                        </div>
                      </Field>

                      <Field label="Additional Message">
                        <textarea
                          placeholder="Tell us about your business, existing brands you stock, and why you'd like to partner with RKS E-Bikes…"
                          value={form.message}
                          onChange={e => set('message', e.target.value)}
                          rows={4}
                          className="input resize-none focus:border-red transition-all"
                        />
                      </Field>
                    </div>
                  </motion.div>

                  {/* ── GDPR + Submit ─────────────────────────────── */}
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={stagger}
                    className="pt-6 border-t border-dark-3 space-y-5"
                  >
                    <motion.label variants={slideUp} className="flex items-start gap-3 cursor-pointer group">
                      <motion.button
                        type="button"
                        onClick={() => set('gdprConsent', !form.gdprConsent)}
                        whileTap={{ scale: 0.88 }}
                        className={`shrink-0 w-5 h-5 mt-0.5 border-2 flex items-center justify-center transition-all ${
                          form.gdprConsent ? 'border-red bg-red' : 'border-dark-3 group-hover:border-red/60'
                        }`}
                      >
                        <AnimatePresence>
                          {form.gdprConsent && (
                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                              <Check className="h-3 w-3 text-white" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                      <span className="text-xs text-light leading-relaxed">
                        I agree to the{' '}
                        <Link href="/privacy" className="text-red hover:text-red/70 underline">Privacy Policy</Link>
                        {' '}and consent to RKS contacting me regarding this trade application.{' '}
                        <span className="text-red">*</span>
                      </span>
                    </motion.label>

                    <AnimatePresence>
                      {apiError && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="p-4 bg-red/10 border border-red/30 text-red text-sm"
                        >
                          {apiError}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div variants={slideUp}>
                      <motion.button
                        type="submit"
                        disabled={submitting}
                        whileHover={{ scale: submitting ? 1 : 1.01 }}
                        whileTap={{ scale: submitting ? 1 : 0.98 }}
                        className={`btn-primary w-full justify-center gap-3 py-4 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {submitting ? (
                          <>
                            <motion.span
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full block"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                            />
                            Submitting Application…
                          </>
                        ) : (
                          <>Submit Application <Send className="h-4 w-4" /></>
                        )}
                      </motion.button>
                    </motion.div>
                  </motion.div>

                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* ── Sticky sidebar ───────────────────────────────────── */}
          <motion.div
            className="space-y-5 lg:sticky lg:top-[100px] h-fit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* What happens next */}
            <div className="bg-dark border border-dark-3 border-t-2 border-t-red p-6">
              <h3 className="text-xl text-off-white mb-5" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                What Happens Next?
              </h3>
              <div className="space-y-4">
                {[
                  { step: '1', text: 'Our trade team reviews your application within 3–5 business days.' },
                  { step: '2', text: 'A trade specialist calls to discuss your requirements and territory.' },
                  { step: '3', text: 'Partnership agreement prepared and signed digitally.' },
                  { step: '4', text: 'Trade portal access, first allocation, and onboarding begins.' },
                ].map((item, i) => (
                  <motion.div
                    key={item.step}
                    className="flex gap-3"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <span className="shrink-0 w-6 h-6 bg-red/10 border border-red/30 flex items-center justify-center text-xs text-red font-bold">
                      {item.step}
                    </span>
                    <p className="text-light text-xs leading-relaxed">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-dark border border-dark-3 p-6">
              <h3 className="text-xl text-off-white mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                Partner Benefits
              </h3>
              <div className="space-y-3">
                {[
                  'Wholesale pricing & volume discounts',
                  'Exclusive territory allocations',
                  'Co-op marketing support',
                  'Factory training & certification',
                  'Priority stock allocation',
                  'Dedicated trade portal access',
                ].map((b, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.07 }}
                  >
                    <span className="shrink-0 w-4 h-4 mt-0.5 bg-red/10 border border-red/30 flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-red" />
                    </span>
                    <span className="text-light text-xs leading-relaxed">{b}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-dark border border-dark-3 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-mid mb-2">Questions?</p>
              <p className="text-off-white font-bold text-sm mb-1">Talk to our trade team</p>
              <p className="text-light text-xs mb-3">For urgent enquiries, contact us directly:</p>
              <a href={`mailto:${tradeEmail}`} className="text-red text-sm hover:text-red/70 transition-colors font-semibold">
                {tradeEmail}
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
