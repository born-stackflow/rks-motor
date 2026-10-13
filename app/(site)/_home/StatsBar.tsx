'use client'

import { motion } from 'framer-motion'
import { useMessages } from '@/contexts/LanguageContext'
import { homeMessages } from '@/lib/i18n/messages/home'
import { cn } from '@/lib/utils'

const COLUMNS = ['md:grid-cols-1', 'md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-4']

const STRIPES =
  'repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.1) 60px, rgba(255,255,255,0.1) 61px)'

/** Figures come only from Site Settings → Stats bar; without them the band is not rendered at all. */
export function StatsBar({ stats }: { stats: Array<{ value: string; label: string }> }) {
  const t = useMessages(homeMessages).stats
  if (stats.length === 0) return null

  return (
    <section aria-label={t.label} className="relative overflow-hidden py-10">
      <div className="absolute inset-0 bg-red">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: STRIPES }}
          animate={{ x: ['0px', '61px'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <div className="container relative">
        <dl
          className={cn(
            'grid grid-cols-2 gap-8 divide-x divide-white/20',
            COLUMNS[Math.min(stats.length, 4) - 1],
          )}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={`${stat.label}-${i}`}
              initial={{ y: 16 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <dt className="order-2 text-xs font-semibold uppercase tracking-[0.15em] text-white">{stat.label}</dt>
              <dd className="order-1 mb-1 font-display text-4xl tracking-[0.04em] text-white md:text-5xl">
                {stat.value}
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  )
}
