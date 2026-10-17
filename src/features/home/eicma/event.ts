/** EICMA 2026 runs 3–8 November at Fiera Milano; times are Milan local (CET). */
export const EICMA = {
  opens: new Date('2026-11-03T00:00:00+01:00'),
  closes: new Date('2026-11-09T00:00:00+01:00'),
  poster: '/events/eicma-2026-poster.jpg',
  calendar: '/events/eicma-2026.ics',
  dismissKey: 'rks-eicma-2026-popup',
}

export type EicmaPhase = { kind: 'before'; days: number } | { kind: 'during' } | { kind: 'after' }

export function eicmaPhase(now = new Date()): EicmaPhase {
  if (now >= EICMA.closes) return { kind: 'after' }
  if (now >= EICMA.opens) return { kind: 'during' }
  return { kind: 'before', days: Math.ceil((EICMA.opens.getTime() - now.getTime()) / 86_400_000) }
}
