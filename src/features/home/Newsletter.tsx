'use client'

import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { Honeypot } from '@/components/forms/Honeypot'
import { AlertCircle, CheckCircle, Loader2, Zap } from '@/components/ui/Icon'
import { useLanguage, useMessages } from '@/lib/i18n/LanguageContext'
import { FORM_MESSAGES, submitForm } from '@/lib/forms'
import { homeMessages } from './messages'

type Status = 'idle' | 'sending' | 'success' | 'error'

export function Newsletter() {
  const t = useMessages(homeMessages).newsletter
  const { locale } = useLanguage()
  const formCopy = FORM_MESSAGES[locale]
  const inputId = useId()
  const errorId = useId()
  const successRef = useRef<HTMLParagraphElement>(null)

  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<'invalid' | 'rate-limited' | 'failed' | null>(null)

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
  }, [status])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setError(null)
    const result = await submitForm('/api/newsletter', { email: email.trim() }, locale, honeypot)
    if (result.ok) {
      setStatus('success')
      return
    }
    setStatus('error')
    setError(result.reason)
  }

  const errorText =
    error === 'invalid' ? t.invalid : error === 'rate-limited' ? formCopy.rateLimited : error ? formCopy.failed : null
  const sending = status === 'sending'

  return (
    <section className="section-sm relative overflow-hidden border-t border-dark-3 bg-black">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute h-px w-full bg-gradient-to-r from-transparent via-red/20 to-transparent"
            style={{ top: `${30 + i * 20}%` }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-xl px-4 text-center">
        <div
          aria-hidden="true"
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center border border-red/50 bg-red/10"
        >
          <Zap className="h-6 w-6 text-red" />
        </div>

        <h2 className="mb-2 font-display text-4xl text-off-white">{t.title}</h2>
        <p className="mb-8 text-sm text-light">{t.subtitle}</p>

        {status === 'success' ? (
          <p
            ref={successRef}
            tabIndex={-1}
            role="status"
            className="flex items-center justify-center gap-3 border border-red/30 bg-red/10 px-4 py-4 font-semibold text-off-white animate-fade-in"
          >
            <CheckCircle className="h-5 w-5 flex-shrink-0 text-red-light" />
            {t.success}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="relative text-left">
            <label htmlFor={inputId} className="sr-only">
              {t.label}
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id={inputId}
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                required
                placeholder={t.placeholder}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={error === 'invalid' ? true : undefined}
                aria-describedby={errorText ? errorId : undefined}
                className="input flex-1"
              />
              <button
                type="submit"
                disabled={sending}
                className="btn-primary inline-flex shrink-0 items-center justify-center gap-2 disabled:cursor-wait disabled:opacity-70"
              >
                {sending ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" /> : null}
                {sending ? formCopy.sending : t.subscribe}
              </button>
            </div>
            <Honeypot value={honeypot} onChange={setHoneypot} />
            {errorText ? (
              <p id={errorId} role="alert" className="mt-3 flex items-center gap-2 text-sm text-red-light">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {errorText}
              </p>
            ) : null}
          </form>
        )}

        <p className="mt-4 text-xs text-light">{t.disclaimer}</p>
      </div>
    </section>
  )
}
