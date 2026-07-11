'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Spec {
  label: string
  value: string | number | null | undefined
  unit?: string
}

interface SpecGroup {
  title: string
  specs: Spec[]
}

interface SpecTableProps {
  specs?: Spec[]
  groups?: SpecGroup[]
  className?: string
}

export function SpecTable({ specs, groups, className }: SpecTableProps) {
  if (groups) {
    return (
      <div className={cn('space-y-6', className)}>
        {groups.map((group, gi) => (
          <div key={gi}>
            <h4
              className="text-red text-xl mb-3 uppercase tracking-wider"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              {group.title}
            </h4>
            <SpecRows specs={group.specs} startIndex={gi * 10} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={className}>
      <SpecRows specs={specs ?? []} startIndex={0} />
    </div>
  )
}

function SpecRows({ specs, startIndex }: { specs: Spec[]; startIndex: number }) {
  const visible = specs.filter((s) => s.value !== null && s.value !== undefined && s.value !== '')
  return (
    <div>
      {visible.map((spec, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: (startIndex + i) * 0.04, ease: 'easeOut' }}
          className={cn('spec-row', i % 2 === 1 && 'bg-dark-2/50')}
        >
          <span className="spec-label">{spec.label}</span>
          <span className="spec-value">
            {spec.value}
            {spec.unit && <span className="text-mid ml-1">{spec.unit}</span>}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
