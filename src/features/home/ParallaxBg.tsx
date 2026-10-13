'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { SanityImage, hasImage } from '@/components/sanity/SanityImage'
import type { Image } from '@/lib/sanity/types'

type Props = { image: Image | undefined; opacity: number }

function DriftingImage({ image, opacity }: { image: Image; opacity: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
      style={reducedMotion ? undefined : { y }}
    >
      <SanityImage image={image} alt="" fill sizes="100vw" className="object-cover object-center" style={{ opacity }} />
    </motion.div>
  )
}

/** Faint CMS background that drifts slightly while the section scrolls past. */
export function ParallaxBg({ image, opacity }: Props) {
  return hasImage(image) ? <DriftingImage image={image} opacity={opacity} /> : null
}
