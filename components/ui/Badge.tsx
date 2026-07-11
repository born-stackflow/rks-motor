import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant =
  | 'red' | 'gold' | 'green' | 'amber' | 'dark' | 'outline'
  // backward-compat aliases
  | 'info' | 'danger' | 'premium' | 'secondary' | 'default' | 'success' | 'warning'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variants: Record<BadgeVariant, string> = {
  red:      'bg-red/20 text-red border border-red/40',
  gold:     'bg-gold/20 text-gold border border-gold/40',
  green:    'bg-green-500/20 text-green-400 border border-green-500/30',
  amber:    'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  dark:     'bg-dark-3 text-light border border-dark-3',
  outline:  'bg-transparent text-off-white border border-dark-3',
  // aliases
  info:     'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  danger:   'bg-red/20 text-red border border-red/40',
  premium:  'bg-gold/20 text-gold border border-gold/40',
  secondary:'bg-dark-3 text-light border border-dark-3',
  default:  'bg-dark-3 text-light border border-dark-3',
  success:  'bg-green-500/20 text-green-400 border border-green-500/30',
  warning:  'bg-amber-500/20 text-amber-400 border border-amber-500/30',
}

function Badge({ variant = 'dark', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn('badge', variants[variant], className)}
      {...props}
    />
  )
}

export { Badge }
export type { BadgeProps, BadgeVariant }
