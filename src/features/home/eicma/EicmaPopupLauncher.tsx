'use client'

import { useEffect, useState } from 'react'
import EicmaPopup from './EicmaPopup'
import { EICMA, eicmaPhase, type EicmaPhase } from './event'

/**
 * Opens the EICMA invitation as soon as the home page is ready, on every visit to the site (once per browser
 * session), before and during the fair. Coming back to the home page within the same session does not reopen it.
 */
export function EicmaPopupLauncher() {
  const [phase, setPhase] = useState<Exclude<EicmaPhase, { kind: 'after' }> | null>(null)

  useEffect(() => {
    const current = eicmaPhase()
    if (current.kind === 'after') return
    try {
      if (sessionStorage.getItem(EICMA.dismissKey)) return
      sessionStorage.setItem(EICMA.dismissKey, new Date().toISOString())
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the session flag only exists in the browser; opening must wait for hydration
    setPhase(current)
  }, [])

  if (!phase) return null

  return <EicmaPopup phase={phase} onClose={() => setPhase(null)} />
}
