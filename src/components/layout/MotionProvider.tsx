'use client'

import { LazyMotion } from 'framer-motion'
import type { ReactNode } from 'react'

const loadFeatures = () => import('@/lib/motion/features').then((module) => module.default)

/** Ships only the slim `m` components up front; animation features load after hydration. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  )
}
