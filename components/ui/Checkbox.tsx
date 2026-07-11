import { InputHTMLAttributes, forwardRef } from 'react'
import { Check } from './Icon'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: string
  label?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, error, label, id, checked, ...props }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-2">
        <div className="flex items-start space-x-3">
          <div className="relative">
            <input
              type="checkbox"
              id={checkboxId}
              checked={checked}
              className={`
                sr-only
                ${className || ''}
              `}
              ref={ref}
              {...props}
            />
            <div
              className={`
                w-4 h-4 border-2 rounded cursor-pointer flex items-center justify-center
                transition-colors duration-200
                ${checked 
                  ? 'bg-blue-600 border-blue-600' 
                  : 'border-gray-300 bg-white hover:border-blue-400'
                }
                ${error ? 'border-red-500' : ''}
              `}
              onClick={() => {
                if (!checkboxId) return
                const input = document.getElementById(checkboxId) as HTMLInputElement | null
                input?.click()
              }}
            >
              {checked && <Check className="w-3 h-3 text-white" />}
            </div>
          </div>
          {label && (
            <label htmlFor={checkboxId} className="text-sm text-gray-700 cursor-pointer">
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 ml-7">{error}</p>
        )}
      </div>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }