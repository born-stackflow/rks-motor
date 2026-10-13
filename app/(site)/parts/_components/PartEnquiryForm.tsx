'use client'

import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { Honeypot } from '@/components/forms/Honeypot'
import { AlertCircle, CheckCircle, Loader2, Send } from '@/components/ui/Icon'
import { useLanguage, useMessages } from '@/contexts/LanguageContext'
import { FORM_MESSAGES, submitForm } from '@/lib/forms'
import { partsMessages } from '@/lib/i18n/messages/parts'
import { cn } from '@/lib/utils'

type Mode = 'b2c' | 'b2b'
type EnquiryType = 'purchase' | 'availability' | 'fitment' | 'other'

const ENQUIRY_TYPES: EnquiryType[] = ['purchase', 'availability', 'fitment', 'other']

type Values = {
  name: string
  businessName: string
  vatNumber: string
  email: string
  phone: string
  partName: string
  partNumber: string
  compatibleModel: string
  bikeYear: string
  quantity: string
  enquiryType: EnquiryType
  isRecurring: boolean
  monthlyQuantity: string
  message: string
  gdprConsent: boolean
}

type TextField = { [K in keyof Values]: Values[K] extends string ? K : never }[keyof Values]

/** API field names that differ from the names used in this form. */
const SERVER_FIELDS: Record<string, keyof Values> = {
  fullName: 'name',
  contactName: 'name',
  quantityRequired: 'quantity',
  isRecurringOrder: 'isRecurring',
}

type Props = {
  partName?: string
  partNumber?: string
  /** Model names offered as suggestions for the compatible-model field. */
  models?: string[]
}

function initialValues(partName = '', partNumber = ''): Values {
  return {
    name: '',
    businessName: '',
    vatNumber: '',
    email: '',
    phone: '',
    partName,
    partNumber,
    compatibleModel: '',
    bikeYear: '',
    quantity: '1',
    enquiryType: 'purchase',
    isRecurring: false,
    monthlyQuantity: '',
    message: '',
    gdprConsent: false,
  }
}

function toInt(value: string) {
  return value.trim() === '' ? undefined : Number(value)
}

function optional(value: string) {
  return value.trim() || undefined
}

export function PartEnquiryForm({ partName, partNumber, models = [] }: Props) {
  const { locale } = useLanguage()
  const m = useMessages(partsMessages).form
  const formText = FORM_MESSAGES[locale]
  const id = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  const [mode, setMode] = useState<Mode>('b2c')
  const [values, setValues] = useState<Values>(() => initialValues(partName, partNumber))
  const [honeypot, setHoneypot] = useState('')
  const [invalid, setInvalid] = useState<Set<keyof Values>>(new Set())
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle')
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (invalid.size > 0) formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }, [invalid])

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
  }, [status])

  function update<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((current) => ({ ...current, [key]: value }))
    if (invalid.has(key)) {
      setInvalid((current) => {
        const next = new Set(current)
        next.delete(key)
        return next
      })
    }
  }

  function switchMode(next: Mode) {
    setMode(next)
    setInvalid(new Set())
    setFormError(null)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sending')
    setFormError(null)

    const shared = {
      email: values.email,
      phone: values.phone,
      partName: values.partName,
      partNumber: optional(values.partNumber),
      compatibleModel: optional(values.compatibleModel),
      quantityRequired: toInt(values.quantity),
      message: optional(values.message),
      gdprConsent: values.gdprConsent,
    }
    const result =
      mode === 'b2c'
        ? await submitForm(
            '/api/enquiry-b2c-parts',
            { ...shared, fullName: values.name, bikeYear: toInt(values.bikeYear), enquiryType: values.enquiryType },
            locale,
            honeypot,
          )
        : await submitForm(
            '/api/enquiry-b2b-parts',
            {
              ...shared,
              businessName: values.businessName,
              vatNumber: values.vatNumber,
              contactName: values.name,
              isRecurringOrder: values.isRecurring,
              monthlyQuantity: values.isRecurring ? toInt(values.monthlyQuantity) : undefined,
            },
            locale,
            honeypot,
          )

    if (result.ok) {
      setStatus('success')
      setInvalid(new Set())
      return
    }
    setStatus('idle')
    if (result.reason === 'invalid') {
      const keys = result.fields
        .map((field) => SERVER_FIELDS[field] ?? field)
        .filter((field): field is keyof Values => field in values)
      setFormError(formText.invalid)
      setInvalid(new Set(keys))
    } else {
      setFormError(result.reason === 'rate-limited' ? formText.rateLimited : formText.failed)
    }
  }

  function reset() {
    setValues(initialValues(partName, partNumber))
    setHoneypot('')
    setStatus('idle')
  }

  if (status === 'success') {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="border border-dark-3 bg-dark p-8 text-center outline-none focus-visible:ring-2 focus-visible:ring-red"
      >
        <CheckCircle className="mx-auto mb-4 h-10 w-10 text-green-400" />
        <h3 className="font-display text-3xl leading-none text-off-white mb-3">{m.successTitle}</h3>
        <p className="text-light max-w-md mx-auto leading-relaxed">{m.successText}</p>
        <button type="button" onClick={reset} className="btn-secondary mt-8">
          {m.sendAnother}
        </button>
      </div>
    )
  }

  const fieldId = (key: keyof Values) => `${id}-${key}`
  const errorId = (key: keyof Values) => `${id}-${key}-error`
  const a11y = (key: keyof Values) => ({
    id: fieldId(key),
    'aria-invalid': invalid.has(key) || undefined,
    'aria-describedby': invalid.has(key) ? errorId(key) : undefined,
  })
  const text = (key: TextField) => ({
    ...a11y(key),
    name: key,
    value: values[key],
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      update(key, event.target.value),
  })
  const error = (key: keyof Values) =>
    invalid.has(key) ? (
      <p id={errorId(key)} className="mt-1.5 flex items-center gap-1.5 text-xs text-red-light">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        {m.fieldError}
      </p>
    ) : null

  const field = (key: keyof Values, label: string, control: ReactNode, opts: { optional?: boolean; wide?: boolean } = {}) => (
    <div className={cn(opts.wide && 'sm:col-span-2')}>
      <label htmlFor={fieldId(key)} className="label">
        {label}
        {opts.optional ? <span className="ml-1 font-normal normal-case tracking-normal text-light">({m.optional})</span> : null}
      </label>
      {control}
      {error(key)}
    </div>
  )

  const listId = `${id}-models`
  const sending = status === 'sending'

  return (
    <form ref={formRef} onSubmit={onSubmit} className="relative border border-dark-3 bg-dark p-5 sm:p-8">
      <Honeypot value={honeypot} onChange={setHoneypot} />

      <fieldset className="mb-6">
        <legend className="label">{m.customerType}</legend>
        <div className="grid grid-cols-2 gap-2">
          {(['b2c', 'b2b'] as const).map((option) => (
            <label key={option} className="cursor-pointer">
              <input
                type="radio"
                name="customerType"
                value={option}
                checked={mode === option}
                onChange={() => switchMode(option)}
                className="peer sr-only"
              />
              <span className="flex min-h-11 items-center justify-center border border-dark-3 px-3 text-center text-xs font-semibold uppercase tracking-widest text-light transition-colors hover:text-off-white peer-checked:border-red peer-checked:bg-red peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-red">
                {option === 'b2c' ? m.private : m.business}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {mode === 'b2b' ? (
          <>
            {field('businessName', m.businessName, <input {...text('businessName')} required autoComplete="organization" className="input" />)}
            {field('vatNumber', m.vatNumber, <input {...text('vatNumber')} required className="input" />)}
          </>
        ) : null}
        {field(
          'name',
          mode === 'b2c' ? m.fullName : m.contactName,
          <input {...text('name')} required autoComplete="name" className="input" />,
          { wide: true },
        )}
        {field('email', m.email, <input {...text('email')} type="email" required autoComplete="email" className="input" />)}
        {field('phone', m.phone, <input {...text('phone')} type="tel" required autoComplete="tel" className="input" />)}

        {field('partName', m.partName, <input {...text('partName')} required className="input" />)}
        {field('partNumber', m.partNumber, <input {...text('partNumber')} className="input font-mono" />, { optional: true })}
        {field(
          'compatibleModel',
          m.compatibleModel,
          <>
            <input {...text('compatibleModel')} list={models.length ? listId : undefined} className="input" />
            {models.length ? (
              <datalist id={listId}>
                {models.map((model) => (
                  <option key={model} value={model} />
                ))}
              </datalist>
            ) : null}
          </>,
          { optional: true },
        )}
        {mode === 'b2c'
          ? field(
              'bikeYear',
              m.bikeYear,
              <input {...text('bikeYear')} type="number" inputMode="numeric" min={1950} max={2100} className="input" />,
              { optional: true },
            )
          : null}
        {field(
          'quantity',
          m.quantity,
          <input {...text('quantity')} type="number" inputMode="numeric" min={1} required className="input" />,
        )}
        {mode === 'b2c'
          ? field(
              'enquiryType',
              m.enquiryType,
              <select
                {...a11y('enquiryType')}
                name="enquiryType"
                value={values.enquiryType}
                onChange={(event) =>
                  update('enquiryType', ENQUIRY_TYPES.find((type) => type === event.target.value) ?? 'other')
                }
                className="select"
              >
                {ENQUIRY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {m.enquiryTypes[type]}
                  </option>
                ))}
              </select>,
            )
          : null}

        {mode === 'b2b' ? (
          <>
            <div className="flex items-center sm:min-h-[4.75rem] sm:pt-6">
              <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-light">
                <input
                  type="checkbox"
                  name="isRecurringOrder"
                  checked={values.isRecurring}
                  onChange={(event) => update('isRecurring', event.target.checked)}
                  className="h-5 w-5 shrink-0 accent-red"
                />
                {m.recurring}
              </label>
            </div>
            {values.isRecurring
              ? field(
                  'monthlyQuantity',
                  m.monthlyQuantity,
                  <input {...text('monthlyQuantity')} type="number" inputMode="numeric" min={1} required className="input" />,
                )
              : null}
          </>
        ) : null}

        {field(
          'message',
          m.message,
          <textarea {...text('message')} rows={4} placeholder={m.messagePlaceholder} className="input resize-y" />,
          { optional: true, wide: true },
        )}

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-light">
            <input
              type="checkbox"
              name="gdprConsent"
              required
              checked={values.gdprConsent}
              onChange={(event) => update('gdprConsent', event.target.checked)}
              aria-invalid={invalid.has('gdprConsent') || undefined}
              aria-describedby={invalid.has('gdprConsent') ? errorId('gdprConsent') : undefined}
              className="mt-0.5 h-5 w-5 shrink-0 accent-red"
            />
            {formText.consent}
          </label>
          {error('gdprConsent')}
        </div>
      </div>

      {formError ? (
        <p role="alert" className="mt-6 flex items-start gap-2 border border-red/40 bg-red/10 p-4 text-sm text-off-white">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-light" />
          {formError}
        </p>
      ) : null}

      <button type="submit" disabled={sending} className="btn-primary mt-6 w-full justify-center disabled:cursor-wait disabled:opacity-70 sm:w-auto">
        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {sending ? formText.sending : m.submit}
      </button>
    </form>
  )
}
