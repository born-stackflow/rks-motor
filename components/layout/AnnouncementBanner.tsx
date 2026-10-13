'use client'

import { useEffect, useState } from 'react'
import { X } from '@/components/ui/Icon'
import { useLanguage } from '@/contexts/LanguageContext'

const STORAGE_KEY = 'rks-dismissed-banner'

export function AnnouncementBanner({ text }: { text: string }) {
  const { t } = useLanguage()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let dismissed: string | null = null
    try {
      dismissed = localStorage.getItem(STORAGE_KEY)
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the dismissal lives in localStorage, which only exists in the browser
    setVisible(dismissed !== text)
  }, [text])

  if (!visible) return null

  return (
    <div className="relative z-[60] bg-red text-white">
      <div className="container flex min-h-10 items-center justify-center gap-4 py-2 pr-10 text-center text-xs font-semibold uppercase tracking-widest">
        <p>{text}</p>
        <button
          type="button"
          onClick={() => {
            setVisible(false)
            try {
              localStorage.setItem(STORAGE_KEY, text)
            } catch {}
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 opacity-80 hover:opacity-100"
          aria-label={t.banner.close}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
