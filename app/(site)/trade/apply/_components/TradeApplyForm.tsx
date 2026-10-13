'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useLanguage, useMessages } from '@/contexts/LanguageContext'
import { tradeMessages } from '@/lib/i18n/messages/trade'
import { FORM_MESSAGES, submitForm } from '@/lib/forms'
import { BRAND_ORDER, brandLabel } from '@/lib/site'
import { Honeypot } from '@/components/forms/Honeypot'
import { ArrowLeft, ArrowRight, Check, CheckCircle, Send } from '@/components/ui/Icon'
import { Field, FieldError, FormAlert, choiceCard, describedBy } from '@/components/forms/FormField'
import type { ModelNavItem } from '@/lib/sanity/types'

const BUSINESS_TYPES = ['dealer', 'distributor', 'wholesaler', 'fleet', 'importer', 'other'] as const
const QUANTITIES = ['1-5', '6-15', '16-30', '30+'] as const
const REFERRAL_SOURCES = ['google', 'trade-show', 'referral', 'social-media', 'other'] as const

type BusinessType = (typeof BUSINESS_TYPES)[number]
type Quantity = (typeof QUANTITIES)[number]
type ReferralSource = (typeof REFERRAL_SOURCES)[number]

type Values = {
  businessType: BusinessType | ''
  businessName: string
  vatNumber: string
  address: string
  city: string
  country: string
  website: string
  hasShowroom: '' | 'yes' | 'no'
  contactName: string
  jobTitle: string
  email: string
  phone: string
  whatsapp: string
  modelsOfInterest: string[]
  estimatedQuantity: Quantity | ''
  referralSource: ReferralSource | ''
  message: string
  gdprConsent: boolean
}

type FieldName = keyof Values
type Errors = Partial<Record<FieldName, string>>

const EMPTY: Values = {
  businessType: '',
  businessName: '',
  vatNumber: '',
  address: '',
  city: '',
  country: '',
  website: '',
  hasShowroom: '',
  contactName: '',
  jobTitle: '',
  email: '',
  phone: '',
  whatsapp: '',
  modelsOfInterest: [],
  estimatedQuantity: '',
  referralSource: '',
  message: '',
  gdprConsent: false,
}

const STEP_FIELDS: FieldName[][] = [
  ['businessType', 'businessName', 'vatNumber', 'address', 'city', 'country', 'website', 'hasShowroom'],
  ['contactName', 'jobTitle', 'email', 'phone', 'whatsapp'],
  ['modelsOfInterest', 'estimatedQuantity'],
  ['referralSource', 'message', 'gdprConsent'],
]
const LAST_STEP = STEP_FIELDS.length - 1

const REQUIRED_TEXT = new Set<FieldName>([
  'businessName',
  'vatNumber',
  'address',
  'city',
  'country',
  'contactName',
  'jobTitle',
  'phone',
])

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const fieldId = (name: FieldName) => `trade-${name}`
const stepOfField = (name: FieldName) => STEP_FIELDS.findIndex((fields) => fields.includes(name))

function normalizeWebsite(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ''
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

function isValidWebsite(value: string) {
  try {
    const url = new URL(value)
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.includes('.')
  } catch {
    return false
  }
}

function isInvalid(name: FieldName, values: Values) {
  if (REQUIRED_TEXT.has(name)) return !String(values[name]).trim()
  switch (name) {
    case 'businessType':
      return !values.businessType
    case 'email':
      return !EMAIL_PATTERN.test(values.email.trim())
    case 'website': {
      const website = normalizeWebsite(values.website)
      return website !== '' && !isValidWebsite(website)
    }
    case 'gdprConsent':
      return !values.gdprConsent
    default:
      return false
  }
}

type Props = {
  models: ModelNavItem[]
}

export function TradeApplyForm({ models }: Props) {
  const { locale } = useLanguage()
  const m = useMessages(tradeMessages).apply
  const formText = FORM_MESSAGES[locale]

  const [values, setValues] = useState<Values>(EMPTY)
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState<Values | null>(null)
  const [focusRequest, setFocusRequest] = useState<{ field?: FieldName } | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!focusRequest) return
    const target = focusRequest.field
      ? formRef.current?.querySelector<HTMLElement>(`[name="${focusRequest.field}"]`)
      : null
    ;(target ?? headingRef.current)?.focus()
  }, [focusRequest])

  useEffect(() => {
    if (sent) successRef.current?.focus()
  }, [sent])

  const errorFor = (name: FieldName) => {
    if (REQUIRED_TEXT.has(name)) return m.errors.required
    switch (name) {
      case 'businessType':
        return m.errors.businessType
      case 'email':
        return m.errors.email
      case 'website':
        return m.errors.website
      case 'gdprConsent':
        return m.errors.gdprConsent
      default:
        return m.errors.generic
    }
  }

  const set = <K extends FieldName>(name: K, value: Values[K]) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current))
  }

  const toggleModel = (name: string) => {
    set(
      'modelsOfInterest',
      values.modelsOfInterest.includes(name)
        ? values.modelsOfInterest.filter((model) => model !== name)
        : [...values.modelsOfInterest, name],
    )
  }

  const showErrors = (fields: FieldName[]) => {
    const firstStep = Math.min(...fields.map(stepOfField))
    setErrors(Object.fromEntries(fields.map((name) => [name, errorFor(name)])))
    setFormError(formText.invalid)
    setStep(firstStep)
    setFocusRequest({ field: fields.find((name) => stepOfField(name) === firstStep) })
  }

  const goTo = (target: number) => {
    setFormError('')
    setStep(target)
    setFocusRequest({})
  }

  const send = async () => {
    const payload: Record<string, unknown> = {
      businessName: values.businessName.trim(),
      businessType: values.businessType,
      vatNumber: values.vatNumber.trim(),
      address: values.address.trim(),
      city: values.city.trim(),
      country: values.country.trim(),
      contactName: values.contactName.trim(),
      jobTitle: values.jobTitle.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      modelsOfInterest: values.modelsOfInterest,
      gdprConsent: true,
    }
    const website = normalizeWebsite(values.website)
    if (website) payload.website = website
    if (values.whatsapp.trim()) payload.whatsapp = values.whatsapp.trim()
    if (values.estimatedQuantity) payload.estimatedQuantity = values.estimatedQuantity
    if (values.hasShowroom) payload.hasShowroom = values.hasShowroom === 'yes'
    if (values.referralSource) payload.referralSource = values.referralSource
    if (values.message.trim()) payload.message = values.message.trim()

    setSending(true)
    const result = await submitForm('/api/enquiry-b2b', payload, locale, honeypot)
    setSending(false)

    if (result.ok) {
      setSent(values)
      return
    }
    if (result.reason === 'invalid') {
      const fields = result.fields
        .map((path) => path.split('.')[0])
        .filter((name): name is FieldName => name in EMPTY)
      if (fields.length) {
        showErrors(fields)
        return
      }
    }
    setFormError(result.reason === 'rate-limited' ? formText.rateLimited : formText.failed)
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (sending) return
    setFormError('')

    if (step < LAST_STEP) {
      const invalid = STEP_FIELDS[step].filter((name) => isInvalid(name, values))
      if (invalid.length) showErrors(invalid)
      else goTo(step + 1)
      return
    }

    const invalid = STEP_FIELDS.flat().filter((name) => isInvalid(name, values))
    if (invalid.length) {
      showErrors(invalid)
      return
    }
    await send()
  }

  if (sent) {
    const businessType = sent.businessType ? m.business.types[sent.businessType].label : ''
    const summary: Array<[string, string]> = [
      [m.success.business, sent.businessName],
      [m.success.type, businessType],
      [m.success.location, [sent.city, sent.country].filter(Boolean).join(', ')],
      [m.success.models, sent.modelsOfInterest.length ? sent.modelsOfInterest.join(', ') : m.success.noModels],
    ]
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="border border-green-500/30 bg-dark p-6 sm:p-10 outline-none animate-fade-up"
      >
        <div className="flex items-center gap-4 mb-6">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-green-500/30 bg-green-500/10 text-green-400">
            <CheckCircle className="h-7 w-7" />
          </span>
          <h2 className="font-display text-4xl text-off-white leading-none">{m.success.title}</h2>
        </div>
        <p className="text-light leading-relaxed">{m.success.text(sent.contactName.trim(), sent.email.trim())}</p>
        <h3 className="label mt-8">{m.success.summary}</h3>
        <dl className="border border-dark-3 divide-y divide-dark-3 text-sm">
          {summary.map(([label, value]) => (
            <div key={label} className="grid gap-1 p-3 sm:grid-cols-[140px_1fr] sm:gap-4">
              <dt className="text-light">{label}</dt>
              <dd className="text-off-white break-words">{value}</dd>
            </div>
          ))}
        </dl>
        <Link href="/trade" className="btn-secondary mt-8">
          <span aria-hidden="true">
            <ArrowLeft className="h-4 w-4" />
          </span>
          {m.success.back}
        </Link>
      </div>
    )
  }

  const stepTitles = [m.business.title, m.contact.title, m.models.title, m.details.title]

  const textInput = (
    name: Exclude<FieldName, 'modelsOfInterest' | 'gdprConsent' | 'hasShowroom' | 'businessType' | 'estimatedQuantity' | 'referralSource' | 'message'>,
    label: string,
    options: {
      type?: 'text' | 'email' | 'tel' | 'url'
      autoComplete?: string
      maxLength: number
      placeholder?: string
      optional?: boolean
      onBlur?: () => void
    },
  ) => (
    <Field
      id={fieldId(name)}
      label={label}
      required={!options.optional}
      optionalLabel={options.optional ? m.optional : undefined}
      error={errors[name]}
    >
      {(control) => (
        <input
          {...control}
          name={name}
          type={options.type ?? 'text'}
          autoComplete={options.autoComplete}
          maxLength={options.maxLength}
          placeholder={options.placeholder}
          value={values[name]}
          onChange={(e) => set(name, e.target.value)}
          onBlur={options.onBlur}
          className="input"
        />
      )}
    </Field>
  )

  const groups = [...BRAND_ORDER, ...new Set(models.map((model) => model.brand).filter((brand) => !BRAND_ORDER.includes(brand)))]
    .map((brand) => ({ brand, items: models.filter((model) => model.brand === brand) }))
    .filter((group) => group.items.length)

  return (
    <div>
      <nav aria-label={m.progress} className="mb-10">
        <ol className="flex items-center gap-2">
          {m.steps.map((label, i) => {
            const done = i < step
            const current = i === step
            const content = (
              <>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center border text-xs font-bold ${
                    done || current ? 'border-red bg-red text-white' : 'border-dark-3 text-light'
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span
                  className={`sr-only text-xs font-semibold uppercase tracking-wider sm:not-sr-only ${
                    current ? 'text-off-white' : 'text-light'
                  }`}
                >
                  {label}
                </span>
              </>
            )
            return (
              <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
                {done ? (
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    className="flex min-h-[40px] items-center gap-2 hover:text-off-white focus-visible:outline-2 focus-visible:outline-red"
                  >
                    {content}
                  </button>
                ) : (
                  <span aria-current={current ? 'step' : undefined} className="flex min-h-[40px] items-center gap-2">
                    {content}
                  </span>
                )}
                {i < LAST_STEP ? (
                  <span aria-hidden="true" className={`h-px flex-1 ${done ? 'bg-red/60' : 'bg-dark-3'}`} />
                ) : null}
              </li>
            )
          })}
        </ol>
      </nav>

      <form ref={formRef} onSubmit={onSubmit} noValidate className="relative" aria-busy={sending}>
        <Honeypot value={honeypot} onChange={setHoneypot} />

        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red mb-2">{m.stepOf(step + 1, STEP_FIELDS.length)}</p>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-4xl text-off-white leading-none mb-8 pb-4 border-b border-dark-3 outline-none"
        >
          {stepTitles[step]}
        </h2>

        <div className="space-y-6">
          {step === 0 ? (
            <>
              <fieldset aria-describedby={describedBy(fieldId('businessType'), null, errors.businessType)}>
                <legend className="label">
                  {m.business.typeLegend}
                  <span aria-hidden="true" className="text-red-light ml-1">*</span>
                </legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {BUSINESS_TYPES.map((type) => (
                    <label key={type} className={`${choiceCard} min-h-[64px] flex-col justify-center gap-1 p-3`}>
                      <input
                        type="radio"
                        name="businessType"
                        value={type}
                        checked={values.businessType === type}
                        onChange={() => set('businessType', type)}
                        className="sr-only"
                      />
                      <span className="text-xs font-bold uppercase tracking-wide">{m.business.types[type].label}</span>
                      <span className="text-[11px] leading-tight text-light">{m.business.types[type].desc}</span>
                    </label>
                  ))}
                </div>
                <FieldError id={fieldId('businessType')} error={errors.businessType} />
              </fieldset>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {textInput('businessName', m.business.businessName, {
                  autoComplete: 'organization',
                  maxLength: 160,
                  placeholder: m.business.businessNamePlaceholder,
                })}
                {textInput('vatNumber', m.business.vatNumber, { maxLength: 40, placeholder: m.business.vatNumberPlaceholder })}
                {textInput('address', m.business.address, { autoComplete: 'street-address', maxLength: 200 })}
                {textInput('city', m.business.city, { autoComplete: 'address-level2', maxLength: 120 })}
                {textInput('country', m.business.country, { autoComplete: 'country-name', maxLength: 120 })}
                {textInput('website', m.business.website, {
                  type: 'url',
                  autoComplete: 'url',
                  maxLength: 300,
                  placeholder: m.business.websitePlaceholder,
                  optional: true,
                  onBlur: () => {
                    const website = normalizeWebsite(values.website)
                    if (website !== values.website) setValues((current) => ({ ...current, website }))
                  },
                })}
                <Field
                  id={fieldId('hasShowroom')}
                  label={m.business.showroom}
                  optionalLabel={m.optional}
                  error={errors.hasShowroom}
                >
                  {(control) => (
                    <select
                      {...control}
                      name="hasShowroom"
                      value={values.hasShowroom}
                      onChange={(e) => set('hasShowroom', e.target.value === 'yes' ? 'yes' : e.target.value === 'no' ? 'no' : '')}
                      className="select"
                    >
                      <option value="">{m.business.showroomUnset}</option>
                      <option value="yes">{m.business.yes}</option>
                      <option value="no">{m.business.no}</option>
                    </select>
                  )}
                </Field>
              </div>
            </>
          ) : null}

          {step === 1 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {textInput('contactName', m.contact.contactName, {
                autoComplete: 'name',
                maxLength: 120,
                placeholder: m.contact.contactNamePlaceholder,
              })}
              {textInput('jobTitle', m.contact.jobTitle, {
                autoComplete: 'organization-title',
                maxLength: 120,
                placeholder: m.contact.jobTitlePlaceholder,
              })}
              {textInput('email', m.contact.email, {
                type: 'email',
                autoComplete: 'email',
                maxLength: 200,
                placeholder: m.contact.emailPlaceholder,
              })}
              {textInput('phone', m.contact.phone, { type: 'tel', autoComplete: 'tel', maxLength: 40, placeholder: '+39 …' })}
              {textInput('whatsapp', m.contact.whatsapp, { type: 'tel', maxLength: 40, placeholder: '+39 …', optional: true })}
            </div>
          ) : null}

          {step === 2 ? (
            <>
              <fieldset aria-describedby={describedBy(fieldId('modelsOfInterest'), true, errors.modelsOfInterest)}>
                <legend className="label">
                  {m.models.legend}
                  <span className="ml-2 normal-case tracking-normal font-normal text-light">({m.optional})</span>
                </legend>
                <p id={`${fieldId('modelsOfInterest')}-hint`} className="text-xs text-light mb-4" aria-live="polite">
                  {models.length
                    ? `${m.models.hint} ${values.modelsOfInterest.length ? m.models.selected(values.modelsOfInterest.length) : ''}`
                    : m.models.none}
                </p>
                <div className="space-y-6">
                  {groups.map((group) => (
                    <div key={group.brand}>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red mb-2">{brandLabel(group.brand)}</p>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {group.items.map((model) => (
                          <label key={model._id} className={`${choiceCard} min-h-[48px] items-center gap-3 px-4 py-3`}>
                            <input
                              type="checkbox"
                              name="modelsOfInterest"
                              value={model.name}
                              checked={values.modelsOfInterest.includes(model.name)}
                              onChange={() => toggleModel(model.name)}
                              className="h-5 w-5 shrink-0 cursor-pointer accent-red"
                            />
                            <span className="text-sm font-medium">{model.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <FieldError id={fieldId('modelsOfInterest')} error={errors.modelsOfInterest} />
              </fieldset>

              <fieldset aria-describedby={describedBy(fieldId('estimatedQuantity'), true, errors.estimatedQuantity)}>
                <legend className="label">
                  {m.models.quantityLegend}
                  <span className="ml-2 normal-case tracking-normal font-normal text-light">({m.optional})</span>
                </legend>
                <p id={`${fieldId('estimatedQuantity')}-hint`} className="text-xs text-light mb-3">
                  {m.models.quantityHint}
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {QUANTITIES.map((quantity) => (
                    <label key={quantity} className={`${choiceCard} min-h-[56px] items-center justify-center p-2`}>
                      <input
                        type="radio"
                        name="estimatedQuantity"
                        value={quantity}
                        checked={values.estimatedQuantity === quantity}
                        onChange={() => set('estimatedQuantity', quantity)}
                        className="sr-only"
                      />
                      <span className="font-display text-2xl leading-none">{quantity.replace('-', '–')}</span>
                    </label>
                  ))}
                </div>
                <FieldError id={fieldId('estimatedQuantity')} error={errors.estimatedQuantity} />
              </fieldset>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <Field
                id={fieldId('referralSource')}
                label={m.details.referral}
                optionalLabel={m.optional}
                error={errors.referralSource}
              >
                {(control) => (
                  <select
                    {...control}
                    name="referralSource"
                    value={values.referralSource}
                    onChange={(e) => {
                      const source = REFERRAL_SOURCES.find((value) => value === e.target.value)
                      set('referralSource', source ?? '')
                    }}
                    className="select"
                  >
                    <option value="">{m.details.referralUnset}</option>
                    {REFERRAL_SOURCES.map((source) => (
                      <option key={source} value={source}>
                        {m.details.referralOptions[source]}
                      </option>
                    ))}
                  </select>
                )}
              </Field>

              <Field id={fieldId('message')} label={m.details.message} optionalLabel={m.optional} error={errors.message}>
                {(control) => (
                  <textarea
                    {...control}
                    name="message"
                    rows={6}
                    maxLength={5000}
                    placeholder={m.details.messagePlaceholder}
                    value={values.message}
                    onChange={(e) => set('message', e.target.value)}
                    className="input resize-y min-h-[140px]"
                  />
                )}
              </Field>

              <div>
                <label
                  htmlFor={fieldId('gdprConsent')}
                  className="flex items-start gap-3 cursor-pointer text-sm text-light leading-relaxed"
                >
                  <input
                    id={fieldId('gdprConsent')}
                    name="gdprConsent"
                    type="checkbox"
                    checked={values.gdprConsent}
                    onChange={(e) => set('gdprConsent', e.target.checked)}
                    aria-invalid={errors.gdprConsent ? true : undefined}
                    aria-required
                    aria-describedby={errors.gdprConsent ? `${fieldId('gdprConsent')}-error` : undefined}
                    className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-red"
                  />
                  <span>
                    {formText.consent}
                    <span aria-hidden="true" className="text-red-light ml-1">*</span>
                  </span>
                </label>
                <FieldError id={fieldId('gdprConsent')} error={errors.gdprConsent} />
              </div>
            </>
          ) : null}

        </div>

        <div className="mt-6">
          <FormAlert message={formError} />

          <div className="flex flex-col-reverse gap-3 border-t border-dark-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
            {step > 0 ? (
              <button type="button" onClick={() => goTo(step - 1)} className="btn-secondary justify-center">
                <span aria-hidden="true">
                  <ArrowLeft className="h-4 w-4" />
                </span>
                {m.back}
              </button>
            ) : (
              <span className="hidden sm:block" />
            )}
            <button
              type="submit"
              disabled={sending}
              className="btn-primary justify-center disabled:opacity-70 disabled:cursor-wait"
            >
              {step < LAST_STEP ? m.next : sending ? formText.sending : m.submit}
              {sending ? null : (
                <span aria-hidden="true">
                  {step < LAST_STEP ? <ArrowRight className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                </span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
