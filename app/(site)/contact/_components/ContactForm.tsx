'use client'

import { useEffect, useRef, useState, type ComponentType, type FormEvent } from 'react'
import { useLanguage, useMessages } from '@/contexts/LanguageContext'
import { contactMessages } from '@/lib/i18n/messages/contact'
import { FORM_MESSAGES, submitForm } from '@/lib/forms'
import { cart } from '@/lib/cart'
import { Honeypot } from '@/components/forms/Honeypot'
import { CheckCircle, Headphones, Info, Mail, Send, ShoppingCart, Zap } from '@/components/ui/Icon'
import { Field, FieldError, FormAlert, choiceCard } from '@/components/forms/FormField'
import { ENQUIRY_TYPES, MESSAGE_MIN_LENGTH, type ContactPrefill, type EnquiryType } from './enquiry'

const TYPE_ICONS: Record<EnquiryType, ComponentType<{ className?: string }>> = {
  general: Mail,
  'test-ride': Zap,
  purchase: ShoppingCart,
  'after-sales': Headphones,
  other: Info,
}

type Values = {
  fullName: string
  email: string
  phone: string
  enquiryType: EnquiryType
  modelInterested: string
  preferredDealer: string
  gdprConsent: boolean
}

type FieldName = keyof Values | 'message'
type Errors = Partial<Record<FieldName, string>>
type Sent = Values & { message: string; fromList: boolean }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const fieldId = (name: FieldName) => `contact-${name}`

type Props = {
  models: Array<{ name: string; slug: string }>
  prefill: ContactPrefill
}

export function ContactForm({ models, prefill }: Props) {
  const { locale } = useLanguage()
  const m = useMessages(contactMessages)
  const formText = FORM_MESSAGES[locale]

  const initialValues: Values = {
    fullName: '',
    email: '',
    phone: '',
    enquiryType: prefill.enquiryType,
    modelInterested: prefill.modelName,
    preferredDealer: prefill.dealer,
    gdprConsent: false,
  }

  const [values, setValues] = useState<Values>(initialValues)
  // null until the visitor types: the prefilled text follows the language switch until then.
  const [editedMessage, setEditedMessage] = useState<string | null>(null)
  const [usePrefill, setUsePrefill] = useState(true)
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState<Sent | null>(null)
  const [focusRequest, setFocusRequest] = useState<{ field: FieldName } | null>(null)
  const successRef = useRef<HTMLDivElement>(null)

  const fromList = usePrefill && prefill.items.length > 0
  const showDealer = usePrefill && prefill.dealer !== ''

  const prefilledMessage = usePrefill
    ? [
        prefill.items.length ? [m.prefill.items, ...prefill.items.map((item) => `- ${item}`)].join('\n') : '',
        prefill.part ? m.prefill.part(prefill.part) : '',
      ]
        .filter(Boolean)
        .join('\n\n')
    : ''
  const message = editedMessage ?? prefilledMessage
  const messageLength = message.trim().length

  useEffect(() => {
    if (!focusRequest) return
    document.getElementById(fieldId(focusRequest.field))?.focus()
  }, [focusRequest])

  useEffect(() => {
    if (sent) successRef.current?.focus()
  }, [sent])

  const set = <K extends keyof Values>(name: K, value: Values[K]) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current))
  }

  const errorFor = (name: FieldName) => {
    switch (name) {
      case 'fullName':
        return m.errors.fullName
      case 'email':
        return m.errors.email
      case 'phone':
        return m.errors.phone
      case 'message':
        return m.errors.message(MESSAGE_MIN_LENGTH)
      case 'gdprConsent':
        return m.errors.gdprConsent
      default:
        return m.errors.generic
    }
  }

  const validate = (): FieldName[] => {
    const invalid: FieldName[] = []
    if (!values.fullName.trim()) invalid.push('fullName')
    if (!EMAIL_PATTERN.test(values.email.trim())) invalid.push('email')
    if (!values.phone.trim()) invalid.push('phone')
    if (messageLength < MESSAGE_MIN_LENGTH) invalid.push('message')
    if (!values.gdprConsent) invalid.push('gdprConsent')
    return invalid
  }

  const showErrors = (fields: FieldName[]) => {
    setErrors(Object.fromEntries(fields.map((name) => [name, errorFor(name)])))
    setFormError(formText.invalid)
    setFocusRequest({ field: fields[0] })
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (sending) return
    setFormError('')

    const invalid = validate()
    if (invalid.length) {
      showErrors(invalid)
      return
    }

    const payload: Record<string, unknown> = {
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      enquiryType: values.enquiryType,
      message: message.trim(),
      gdprConsent: true,
    }
    if (values.modelInterested) payload.modelInterested = values.modelInterested
    if (showDealer && values.preferredDealer.trim()) payload.preferredDealer = values.preferredDealer.trim()

    setSending(true)
    const result = await submitForm('/api/enquiry-b2c', payload, locale, honeypot)
    setSending(false)

    if (result.ok) {
      if (fromList) cart.clear()
      setSent({ ...values, message: message.trim(), fromList })
      setErrors({})
      return
    }
    if (result.reason === 'invalid') {
      const known = new Set<string>([...Object.keys(initialValues), 'message'])
      const fields = result.fields.map((path) => path.split('.')[0]).filter((name): name is FieldName => known.has(name))
      if (fields.length) {
        showErrors(fields)
        return
      }
      setFormError(formText.failed)
      return
    }
    setFormError(result.reason === 'rate-limited' ? formText.rateLimited : formText.failed)
  }

  const reset = () => {
    setValues({ ...initialValues, enquiryType: 'general', modelInterested: '', preferredDealer: '' })
    setEditedMessage(null)
    setUsePrefill(false)
    setErrors({})
    setFormError('')
    setSent(null)
    setFocusRequest({ field: 'fullName' })
  }

  if (sent) {
    const summary: Array<[string, string]> = [
      [m.success.type, m.form.types[sent.enquiryType].label],
      [m.success.phone, sent.phone],
      ...(sent.modelInterested ? [[m.success.model, sent.modelInterested] as [string, string]] : []),
      ...(sent.preferredDealer && showDealer ? [[m.success.dealer, sent.preferredDealer] as [string, string]] : []),
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
        <p className="text-light leading-relaxed">{m.success.text(sent.email)}</p>
        {sent.fromList ? <p className="text-light leading-relaxed mt-2">{m.success.listCleared}</p> : null}

        <h3 className="label mt-8">{m.success.summary}</h3>
        <dl className="border border-dark-3 divide-y divide-dark-3 text-sm">
          {summary.map(([label, value]) => (
            <div key={label} className="grid gap-1 p-3 sm:grid-cols-[140px_1fr] sm:gap-4">
              <dt className="text-light">{label}</dt>
              <dd className="text-off-white break-words">{value}</dd>
            </div>
          ))}
          <div className="grid gap-1 p-3 sm:grid-cols-[140px_1fr] sm:gap-4">
            <dt className="text-light">{m.success.message}</dt>
            <dd className="text-off-white whitespace-pre-line break-words">{sent.message}</dd>
          </div>
        </dl>

        <button type="button" onClick={reset} className="btn-secondary mt-8">
          {m.success.again}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-6" aria-busy={sending}>
      <Honeypot value={honeypot} onChange={setHoneypot} />

      <fieldset>
        <legend className="label">{m.form.typeLegend}</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
          {ENQUIRY_TYPES.map((type) => {
            const Icon = TYPE_ICONS[type]
            return (
              <label key={type} className={`${choiceCard} min-h-[72px] flex-col items-center justify-center gap-1.5 p-3 text-center`}>
                <input
                  type="radio"
                  name="enquiryType"
                  value={type}
                  checked={values.enquiryType === type}
                  onChange={() => set('enquiryType', type)}
                  className="sr-only"
                />
                <span aria-hidden="true" className="text-red">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wide">{m.form.types[type].label}</span>
                <span className="text-[11px] leading-tight text-light">{m.form.types[type].desc}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id={fieldId('fullName')} label={m.form.fullName} required error={errors.fullName}>
          {(control) => (
            <input
              {...control}
              name="fullName"
              type="text"
              autoComplete="name"
              maxLength={120}
              placeholder={m.form.fullNamePlaceholder}
              value={values.fullName}
              onChange={(e) => set('fullName', e.target.value)}
              className="input"
            />
          )}
        </Field>
        <Field id={fieldId('email')} label={m.form.email} required error={errors.email}>
          {(control) => (
            <input
              {...control}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              maxLength={200}
              placeholder={m.form.emailPlaceholder}
              value={values.email}
              onChange={(e) => set('email', e.target.value)}
              className="input"
            />
          )}
        </Field>
        <Field id={fieldId('phone')} label={m.form.phone} required error={errors.phone}>
          {(control) => (
            <input
              {...control}
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={40}
              placeholder={m.form.phonePlaceholder}
              value={values.phone}
              onChange={(e) => set('phone', e.target.value)}
              className="input"
            />
          )}
        </Field>
        <Field id={fieldId('modelInterested')} label={m.form.model} optionalLabel={m.form.optional} error={errors.modelInterested}>
          {(control) => (
            <select
              {...control}
              name="modelInterested"
              value={values.modelInterested}
              onChange={(e) => set('modelInterested', e.target.value)}
              className="select"
            >
              <option value="">{m.form.modelNone}</option>
              {models.map((model) => (
                <option key={model.slug} value={model.name}>
                  {model.name}
                </option>
              ))}
            </select>
          )}
        </Field>
        {showDealer ? (
          <Field
            id={fieldId('preferredDealer')}
            label={m.form.dealer}
            optionalLabel={m.form.optional}
            error={errors.preferredDealer}
            className="sm:col-span-2"
          >
            {(control) => (
              <input
                {...control}
                name="preferredDealer"
                type="text"
                maxLength={120}
                value={values.preferredDealer}
                onChange={(e) => set('preferredDealer', e.target.value)}
                className="input"
              />
            )}
          </Field>
        ) : null}
      </div>

      <Field
        id={fieldId('message')}
        label={m.form.message}
        required
        error={errors.message}
        hint={
          <>
            {m.form.messageCounter(messageLength, MESSAGE_MIN_LENGTH)}
            {fromList ? <span className="block mt-1">{m.form.fromList}</span> : null}
          </>
        }
      >
        {(control) => (
          <textarea
            {...control}
            name="message"
            rows={fromList ? 8 : 6}
            maxLength={5000}
            placeholder={m.form.messagePlaceholder}
            value={message}
            onChange={(e) => {
              setEditedMessage(e.target.value)
              setErrors((current) => (current.message ? { ...current, message: undefined } : current))
            }}
            className="input resize-y min-h-[140px]"
          />
        )}
      </Field>

      <div>
        <label htmlFor={fieldId('gdprConsent')} className="flex items-start gap-3 cursor-pointer text-sm text-light leading-relaxed">
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

      <div>
        <FormAlert message={formError} />

        <button type="submit" disabled={sending} className="btn-primary w-full justify-center py-4 disabled:opacity-70 disabled:cursor-wait">
          {sending ? formText.sending : m.form.submit}
          {sending ? null : (
            <span aria-hidden="true">
              <Send className="h-4 w-4" />
            </span>
          )}
        </button>
      </div>
    </form>
  )
}
