'use client'

import { useSyncExternalStore } from 'react'

type NetworkInformation = EventTarget & { saveData?: boolean; effectiveType?: string }

function connection(): NetworkInformation | undefined {
  return (navigator as Navigator & { connection?: NetworkInformation }).connection
}

function subscribe(onChange: () => void) {
  const info = connection()
  info?.addEventListener('change', onChange)
  return () => info?.removeEventListener('change', onChange)
}

function isSlow() {
  const info = connection()
  return !!info && (info.saveData === true || info.effectiveType === 'slow-2g' || info.effectiveType === '2g')
}

/** True with Data Saver on or on 2G: background route prefetching is skipped there. */
export function useSlowConnection() {
  return useSyncExternalStore(subscribe, isSlow, () => false)
}
