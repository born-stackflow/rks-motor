'use client'

import { useRef, type MouseEvent, type ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'
import { EmptyState } from '@/components/ui/EmptyState'
import { Gauge } from '@/components/ui/Icon'
import { ModelCard } from '@/components/ui/ModelCard'
import { useMessages } from '@/lib/i18n/LanguageContext'
import { homeMessages } from './messages'
import type { ModelCard as ModelCardData } from '@/lib/sanity/types'
import { SectionHeader } from './SectionHeader'

const RESTING = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'

function TiltCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const element = ref.current
    if (!element || reducedMotion) return
    const rect = element.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 14
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -14
    element.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.02,1.02,1.02)`
  }

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = RESTING
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="h-full transition-transform duration-200 ease-out will-change-transform"
    >
      {children}
    </div>
  )
}

export function FeaturedModels({ models }: { models: ModelCardData[] }) {
  const t = useMessages(homeMessages).models

  return (
    <section className="section relative overflow-hidden bg-black">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(#ffffff_1px,transparent_1px),linear-gradient(90deg,#ffffff_1px,transparent_1px)] [background-size:60px_60px]"
      />
      <div className="container relative">
        <SectionHeader
          tag={t.tag}
          title={t.title}
          link={models.length > 0 ? { href: '/models', label: t.viewAll } : undefined}
        />
        {models.length > 0 ? (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((model, i) => (
              <li key={model._id}>
                <TiltCard>
                  <ModelCard model={model} index={i} />
                </TiltCard>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={Gauge}
            title={t.emptyTitle}
            description={t.emptyDesc}
            action={{ label: t.emptyCta, href: '/contact' }}
          />
        )}
      </div>
    </section>
  )
}
