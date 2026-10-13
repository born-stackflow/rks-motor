import { cn } from '@/lib/utils'

type Props = {
  id: string
  eyebrow: string
  title: string
  subtitle?: string
  className?: string
}

/** Static section heading: always readable, no scroll-triggered fade. */
export function SectionTitle({ id, eyebrow, title, subtitle, className }: Props) {
  return (
    <div className={cn('mb-10', className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red mb-3">{eyebrow}</p>
      <h2 id={id} className="font-display text-5xl md:text-6xl text-off-white leading-none">
        {title}
      </h2>
      <span className="heading-underline" />
      {subtitle ? <p className="mt-4 max-w-2xl text-light text-base md:text-lg leading-relaxed">{subtitle}</p> : null}
    </div>
  )
}
