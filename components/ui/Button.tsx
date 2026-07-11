import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
    | 'outline' | 'link' | 'danger' // backward-compat
  size?: 'sm' | 'md' | 'lg' | 'xl'
    | 'xs' | 'default' | 'icon'     // backward-compat
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  asChild?: boolean
}

const variantMap: Record<string, string> = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  ghost:     'btn-ghost',
  outline:   'btn-secondary',
  link:      'btn-ghost underline underline-offset-4 border-0 px-0',
  danger:    'btn-primary bg-red-dark border-red-dark hover:bg-red',
}

const sizeMap: Record<string, string> = {
  xs:      'px-4 py-1.5 text-xs',
  sm:      'px-5 py-2 text-xs',
  md:      'px-8 py-3.5 text-sm',
  default: 'px-8 py-3.5 text-sm',
  lg:      'px-10 py-4 text-sm',
  xl:      'px-12 py-5 text-base',
  icon:    'w-10 h-10 p-0',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, leftIcon, rightIcon, children, className, disabled, asChild, ...props }, ref) => {
    const base = cn(
      variantMap[variant] ?? 'btn-primary',
      sizeMap[size] ?? sizeMap.md,
      (disabled || loading) && 'opacity-60 cursor-not-allowed pointer-events-none',
      className
    )

    if (asChild) return <span className={base}>{children}</span>

    return (
      <button ref={ref} className={base} disabled={disabled || loading} {...props}>
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }
export type { ButtonProps }
