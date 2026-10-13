'use client'

import Link from 'next/link'
import { ArrowRight } from '@/components/ui/Icon'
import { cn } from '@/lib/utils'

export function SectionTag({ label, className }: { label: string; className?: string }) {
  return (
    <p className={cn('mb-4 inline-flex items-center gap-2', className)}>
      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-red motion-safe:animate-pulse" />
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-red">{label}</span>
    </p>
  )
}

export const SECTION_TITLE = 'font-display text-[clamp(2.5rem,5vw,4rem)] leading-none text-off-white'

type Props = {
  tag: string
  title: string
  link?: { href: string; label: string }
}

/** Tag, title and an optional "view all" link, laid out like every list section of the home page. */
export function SectionHeader({ tag, title, link }: Props) {
  return (
    <div className="mb-12 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div>
        <SectionTag label={tag} />
        <h2 className={SECTION_TITLE}>{title}</h2>
      </div>
      {link ? (
        <Link
          href={link.href}
          className="group flex min-h-10 items-center gap-2 text-sm font-semibold text-light transition-colors hover:text-red"
        >
          {link.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      ) : null}
    </div>
  )
}
