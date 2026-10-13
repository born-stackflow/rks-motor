'use client'

import { Zap } from '@/components/ui/Icon'
import { useMessages } from '@/lib/i18n/LanguageContext'
import { homeMessages } from './messages'
import styles from './home.module.css'

export function Marquee() {
  const items = useMessages(homeMessages).marquee
  const loop = [...items, ...items]

  return (
    <div aria-hidden="true" className="relative select-none overflow-hidden border-y border-dark-3 bg-black py-3">
      <div className={`flex w-max gap-10 whitespace-nowrap ${styles.marquee}`}>
        {loop.map((item, i) => (
          <span
            key={i}
            className="flex flex-shrink-0 items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-light"
          >
            <Zap className="h-3 w-3 text-red" />
            {item}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-black to-transparent" />
    </div>
  )
}
