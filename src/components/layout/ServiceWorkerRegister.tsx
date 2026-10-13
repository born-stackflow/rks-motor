'use client'

import { useEffect } from 'react'

const UPDATE_INTERVAL_MS = 60 * 60 * 1000

/** Registers the asset-cache worker once the page is idle, in production only. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return
    let registration: ServiceWorkerRegistration | undefined
    let lastCheck = Date.now()

    const register = () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          registration = reg
        })
        .catch((error) => console.warn('[sw] registration failed', error))
    }
    const onVisible = () => {
      if (document.visibilityState !== 'visible' || !registration) return
      if (Date.now() - lastCheck < UPDATE_INTERVAL_MS) return
      lastCheck = Date.now()
      registration.update().catch(() => {})
    }

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 2000))
    const handle = idle(register)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.cancelIdleCallback?.(handle as number)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  return null
}
