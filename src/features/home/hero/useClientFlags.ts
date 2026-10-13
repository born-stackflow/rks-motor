'use client'

import { useSyncExternalStore } from 'react'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

const subscribeNever = () => () => {}

/** True while the visitor asks for reduced motion; the server render assumes it so nothing autoplays before hydration. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => true,
  )
}

/** Devices with two cores or fewer skip the WebGL scenes. */
export function useLowPowerDevice() {
  return useSyncExternalStore(
    subscribeNever,
    () => (navigator.hardwareConcurrency ?? 4) <= 2,
    () => true,
  )
}
