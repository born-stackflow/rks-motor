'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface StatCounterProps {
  value: string | number
  label: string
  prefix?: string
  suffix?: string
  color?: 'red' | 'gold' | 'white'
  className?: string
}

function parseNum(v: string | number): { num: number; rest: string } {
  const str = String(v)
  const match = str.match(/^(\d+\.?\d*)(.*)$/)
  return match ? { num: parseFloat(match[1]), rest: match[2] } : { num: 0, rest: str }
}

export function StatCounter({ value, label, prefix = '', suffix = '', color = 'red', className }: StatCounterProps) {
  const { num, rest } = parseNum(value)
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1500
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      setCount(Math.floor(progress * num))
      if (progress < 1) requestAnimationFrame(step)
      else setCount(num)
    }
    requestAnimationFrame(step)
  }, [inView, num])

  const colorMap = {
    red:   'text-red',
    gold:  'text-gold',
    white: 'text-off-white',
  }

  return (
    <div ref={ref} className={cn('text-center', className)}>
      <div
        className={cn('font-display text-5xl md:text-6xl leading-none mb-1', colorMap[color])}
        style={{ fontFamily: 'Bebas Neue, sans-serif' }}
      >
        {prefix}{Number.isInteger(num) ? count : count.toFixed(1)}{rest}{suffix}
      </div>
      <p className="text-light text-sm uppercase tracking-widest font-semibold">{label}</p>
    </div>
  )
}
