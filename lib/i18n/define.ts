import type { Locale } from '@/lib/site'

/** Declares a message namespace; the Italian copy must match the English shape exactly. */
export function defineMessages<T>(messages: { en: T; it: NoInfer<T> }): Record<Locale, T> {
  return messages
}
