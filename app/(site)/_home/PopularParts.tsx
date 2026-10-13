'use client'

import { PartCard } from '@/components/ui/PartCard'
import { useMessages } from '@/contexts/LanguageContext'
import { homeMessages } from '@/lib/i18n/messages/home'
import type { PartCard as PartCardData } from '@/lib/sanity/types'
import { SectionHeader } from './SectionHeader'

/** Featured parts grid; hidden entirely while the catalogue has none. */
export function PopularParts({ parts }: { parts: PartCardData[] }) {
  const t = useMessages(homeMessages).parts
  if (parts.length === 0) return null

  return (
    <section className="section relative overflow-hidden bg-black">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] [background-size:40px_40px]"
      />
      <div className="container relative">
        <SectionHeader tag={t.shopTag} title={t.popularTitle} link={{ href: '/parts', label: t.allParts }} />
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {parts.map((part, i) => (
            <li key={part._id}>
              <PartCard part={part} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
