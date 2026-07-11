'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { translations, type Locale } from '@/lib/i18n/translations'

type Translations = (typeof translations)[Locale]

interface LanguageContextType {
  locale: Locale
  t: Translations
  setLocale: (locale: Locale) => void
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  t: translations.en,
  setLocale: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem('rks-locale') as Locale | null
    if (saved === 'en' || saved === 'it') {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage on mount, must run client-only to avoid SSR hydration mismatch
      setLocaleState(saved)
    } else if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('it')) {
      setLocaleState('it')
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('rks-locale', newLocale)
  }

  return (
    <LanguageContext.Provider value={{ locale, t: translations[locale], setLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
