import { Zap } from './Icon'
import type { ComponentType } from 'react'

interface ImagePlaceholderProps {
  icon?: ComponentType<{ className?: string }>
  className?: string
}

export function ImagePlaceholder({ icon: IconCmp = Zap, className = '' }: ImagePlaceholderProps) {
  return (
    <div className={`absolute inset-0 bg-gradient-to-br from-dark-2 via-dark to-dark-3 flex items-center justify-center ${className}`}>
      <IconCmp className="h-10 w-10 text-off-white/10" />
    </div>
  )
}
