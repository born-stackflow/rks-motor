import Link from 'next/link'
import type { ComponentType } from 'react'
import { ArrowRight, Zap } from './Icon'

type Props = {
  title: string
  description?: string
  action?: { label: string; href: string }
  icon?: ComponentType<{ className?: string }>
  headingLevel?: 'h2' | 'h3'
}

export function EmptyState({ title, description, action, icon: IconCmp = Zap, headingLevel: Heading = 'h3' }: Props) {
  return (
    <div className="border border-dark-3 bg-dark px-6 py-16 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center border border-dark-3 bg-dark-2">
        <IconCmp className="h-6 w-6 text-red" />
      </div>
      <Heading className="font-display text-3xl text-off-white leading-none mb-3">{title}</Heading>
      {description ? <p className="text-light max-w-md mx-auto leading-relaxed">{description}</p> : null}
      {action ? (
        <Link href={action.href} className="btn-primary mt-8 inline-flex items-center gap-2">
          {action.label}
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  )
}
