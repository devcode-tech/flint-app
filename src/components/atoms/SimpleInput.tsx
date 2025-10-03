'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface SimpleInputProps {
  label: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  type?: 'text' | 'email' | 'password'
  required?: boolean
  className?: string
  error?: string
}

export const SimpleInput: React.FC<SimpleInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
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
      
      {/* Input */}
      <div className="flex px-3 py-2 justify-between items-center self-stretch rounded border border-[#E4E7EC] bg-white shadow-sm">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="text-[#141C25] font-inter text-base font-normal leading-6 bg-transparent border-none outline-none flex-1 placeholder:text-[#97A1AF]"
        />
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
