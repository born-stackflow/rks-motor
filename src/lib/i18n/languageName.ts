import type { Locale } from '@/lib/site'

/** Localised, capitalised language name for an ISO 639-1 code (e.g. "it" → "Italian" / "Italiano"). */
export function languageName(code: string, locale: Locale) {
  try {
    const name = new Intl.DisplayNames([locale], { type: 'language' }).of(code)
    return name ? name.charAt(0).toLocaleUpperCase(locale) + name.slice(1) : code.toUpperCase()
  } catch {
    return code.toUpperCase()
  }
}
