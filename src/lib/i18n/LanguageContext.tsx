'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { translations } from './translations'
import type { Locale, Localized } from '@/lib/site'

const STORAGE_KEY = 'rks-locale'

type LanguageContextValue = {
  locale: Locale
  t: (typeof translations)[Locale]
  setLocale: (locale: Locale) => void
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: 'en',
  t: translations.en,
  setLocale: () => {},
})

function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'it') return saved
  } catch {}
  return navigator.language.toLowerCase().startsWith('it') ? 'it' : 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const detected = detectLocale()
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the stored locale only exists in the browser; reading it during render would break hydration
    if (detected !== 'en') setLocaleState(detected)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {}
  }, [])

  const value = useMemo(() => ({ locale, t: translations[locale], setLocale }), [locale, setLocale])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)

export function useLocale() {
  return useContext(LanguageContext).locale
}

export function useMessages<T>(messages: Record<Locale, T>): T {
  return messages[useContext(LanguageContext).locale]
}

export function useLocalized() {
  const locale = useContext(LanguageContext).locale
  return useCallback((value: Localized) => value[locale], [locale])
}
