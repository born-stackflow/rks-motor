'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { EICMA, eicmaPhase, type EicmaPhase } from './event'

const EicmaPopup = dynamic(() => import('./EicmaPopup'), { ssr: false })

const OPEN_DELAY_MS = 1500

/**
 * Shows the EICMA invitation once per visitor, only before and during the fair.
 * The popup code and the poster load only when it is actually going to open, after the page has settled.
 */
export function EicmaPopupLauncher() {
  const [phase, setPhase] = useState<Exclude<EicmaPhase, { kind: 'after' }> | null>(null)

  useEffect(() => {
    const current = eicmaPhase()
    if (current.kind === 'after') return
    try {
      if (localStorage.getItem(EICMA.dismissKey)) return
    } catch {}
    const timer = window.setTimeout(() => setPhase(current), OPEN_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [])

  if (!phase) return null

  return (
    <EicmaPopup
      phase={phase}
      onClose={() => {
        try {
          localStorage.setItem(EICMA.dismissKey, new Date().toISOString())
        } catch {}
        setPhase(null)
      }}
    />
  )
}
