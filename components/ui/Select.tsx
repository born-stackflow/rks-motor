import { SelectHTMLAttributes, forwardRef } from 'react'
import { ChevronDown } from './Icon'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  error?: string
  label?: string
  options: SelectOption[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            className={cn(
              'flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-700 shadow-sm',
              'appearance-none cursor-pointer transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900',
              'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60',
              error && 'border-red-400 focus:ring-red-200',
              className
            )}
            ref={ref}
            {...props}
          >
            {placeholder && <option value="" disabled>{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select }
