import type { ReactNode } from 'react'
import { AlertCircle } from '@/components/ui/Icon'

export type ControlProps = {
  id: string
  'aria-invalid': true | undefined
  'aria-required': true | undefined
  'aria-describedby': string | undefined
}

type FieldProps = {
  id: string
  label: string
  required?: boolean
  optionalLabel?: string
  error?: string
  hint?: ReactNode
  className?: string
  children: (control: ControlProps) => ReactNode
}

export function describedBy(id: string, hint: unknown, error: unknown) {
  return [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined
}

/** Label, control, hint and error wired together through ids, so screen readers announce all of them. */
export function Field({ id, label, required, optionalLabel, error, hint, className, children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-red-light ml-1">*</span>
        ) : optionalLabel ? (
          <span className="ml-2 normal-case tracking-normal font-normal text-light">({optionalLabel})</span>
        ) : null}
      </label>
      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-required': required ? true : undefined,
        'aria-describedby': describedBy(id, hint, error),
      })}
      {hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-light">
          {hint}
        </p>
      ) : null}
      <FieldError id={id} error={error} />
    </div>
  )
}

export function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null
  return (
    <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-xs text-red-light">
      <span aria-hidden="true" className="shrink-0 mt-px">
        <AlertCircle className="h-3.5 w-3.5" />
      </span>
      {error}
    </p>
  )
}

/** Always mounted so that assistive technologies announce the message as soon as it appears. */
export function FormAlert({ message }: { message: string }) {
  return (
    <div role="alert">
      {message ? (
        <div className="mb-6 flex items-start gap-3 border border-red/40 bg-red/10 p-4 text-sm text-off-white">
          <span aria-hidden="true" className="shrink-0 mt-0.5 text-red-light">
            <AlertCircle className="h-4 w-4" />
          </span>
          {message}
        </div>
      ) : null}
    </div>
  )
}

/** Card look for a native radio/checkbox wrapped in its label; the input stays focusable and keyboard-operable. */
export const choiceCard =
  'relative flex cursor-pointer border border-dark-3 bg-dark text-light transition-colors hover:border-red/60 ' +
  'has-[:checked]:border-red has-[:checked]:bg-red/10 has-[:checked]:text-off-white ' +
  'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-red'
