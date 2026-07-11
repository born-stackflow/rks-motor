import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

type CardVariant = 'default' | 'elevated' | 'bordered'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  redTop?: boolean
}

const variantMap: Record<CardVariant, string> = {
  default:  'card',
  elevated: 'card-elevated',
  bordered: 'bg-transparent border border-dark-3 hover:border-red transition-all duration-300',
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', redTop = false, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(variantMap[variant], redTop && 'border-t-2 border-t-red', className)}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pb-0', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('font-bold text-lg leading-tight text-off-white', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-light mt-1.5 leading-relaxed', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

export { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription }
