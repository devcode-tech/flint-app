'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Control, Controller } from 'react-hook-form'

interface Option {
  value: string
  label: string
}

interface FormDropdownProps {
  label: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  options: Option[]
  required?: boolean
  className?: string
  error?: string
  name: string
  control?: Control<any>
  onFocus?: () => void
}

const FormDropdownComponent: React.FC<FormDropdownProps> = ({
  label,
  placeholder,
  value,
  onChange,
  options,
  required = false,
  className,
  error,
  name,
  control,
  onFocus
}) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const selectedOption = options.find(option => option.value === value)
  
  const handleSelect = (optionValue: string, fieldOnChange?: (value: string) => void) => {
    if (fieldOnChange) {
      fieldOnChange(optionValue)
    } else {
      onChange?.(optionValue)
    }
    setIsOpen(false)
  }

  const renderDropdown = (currentValue?: string, fieldOnChange?: (value: string) => void) => {
    const currentSelectedOption = options.find(option => option.value === currentValue)
    
    return (
      <>
        <div className={cn('flex flex-col items-start gap-2 self-stretch relative', className)}>
          {/* Label */}
          <div className="flex items-center gap-1">
            <label className="text-[#141C25] font-inter text-sm font-medium leading-5">
              {label}
            </label>
            {required && (
              <span className="text-red-500 text-sm">*</span>
            )}
          </div>
          
          {/* Dropdown */}
          <div className="relative w-full">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              onFocus={onFocus}
              className={cn(
                'flex px-3 py-2 justify-between items-center w-full rounded border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005EB8] focus:border-transparent',
                error ? 'border-red-500' : 'border-[#E4E7EC]'
              )}
            >
              <span className={cn(
                'font-inter text-base font-normal leading-6',
                currentSelectedOption ? 'text-[#141C25]' : 'text-[#97A1AF]'
              )}>
                {currentSelectedOption ? currentSelectedOption.label : placeholder}
              </span>
              <ChevronDown className="w-5 h-5 text-[#637083]" />
            </button>
            
            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-[#E4E7EC] rounded-xl shadow-lg">
                <div className="flex flex-col p-2">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value, fieldOnChange)}
                      className="flex px-4 py-2 items-center gap-1.5 self-stretch rounded hover:bg-[#F9FAFB] text-left"
                    >
                      <div className="flex-1 text-[#344051] font-inter text-sm font-normal leading-5 capitalize">
                        {option.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Error message */}
          {error && (
            <div className="text-red-500 text-xs font-normal">
              {error}
            </div>
          )}
        </div>
        
        {/* Backdrop to close dropdown */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </>
    )
  }

  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => renderDropdown(field.value, field.onChange)}
      />
    )
  }
  
  return renderDropdown(value, onChange)
}

export const FormDropdown = FormDropdownComponent
export default FormDropdown
