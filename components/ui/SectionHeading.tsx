'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  tag?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({ title, subtitle, tag, align = 'left', className }: SectionHeadingProps) {
  const isCenter = align === 'center'
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(isCenter ? 'text-center' : 'text-left', className)}
    >
      {tag && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red mb-3">{tag}</p>
      )}
      <h2
        className="font-display text-5xl md:text-6xl lg:text-7xl text-off-white leading-none"
        style={{ fontFamily: 'Bebas Neue, sans-serif' }}
      >
        {title}
      </h2>
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
        style={{ originX: isCenter ? 0.5 : 0 }}
        className={cn('heading-underline', isCenter && 'heading-underline-center')}
      />
      {subtitle && (
        <p className={cn('mt-4 text-light text-base md:text-lg max-w-2xl leading-relaxed', isCenter && 'mx-auto')}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
