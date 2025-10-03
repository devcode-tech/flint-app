'use client'

import React from 'react'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormDatePickerProps {
  label: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  required?: boolean
  className?: string
  error?: string
}

export const FormDatePicker: React.FC<FormDatePickerProps> = ({
  label,
  placeholder = 'dd/mm/yy',
  value,
  onChange,
  required = false,
  className,
  error
}) => {
  return (
    <div className={cn('flex flex-col items-start gap-2 self-stretch', className)}>
      {/* Label */}
      <div className="flex items-center gap-1">
        <div className="text-[#141C25] font-inter text-sm font-medium leading-5">
          {label}
        </div>
        {required && (
          <span className="text-red-500 text-sm">*</span>
        )}
      </div>
      
      {/* Date Input */}
      <div className="flex px-3 py-2 justify-between items-center self-stretch rounded border border-[#E4E7EC] bg-white shadow-sm">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="text-[#141C25] font-inter text-base font-normal leading-6 bg-transparent border-none outline-none flex-1 placeholder:text-[#97A1AF]"
          placeholder={placeholder}
        />
        <Calendar className="w-5 h-5 text-[#637083]" />
      </div>
      
      {/* Error message */}
      {error && (
        <div className="text-red-500 text-xs font-normal">
          {error}
        </div>
      )}
    </div>
  )
}
