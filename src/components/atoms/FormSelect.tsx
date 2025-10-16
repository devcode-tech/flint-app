'use client'

import React from 'react'
import * as Select from '@radix-ui/react-select'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Control, Controller } from 'react-hook-form'

interface Option {
  value: string
  label: string
}

interface FormSelectProps {
  label: string
  placeholder?: string
  options: Option[]
  required?: boolean
  className?: string
  error?: string
  name: string
  control: Control<any>
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  placeholder,
  options,
  required = false,
  className,
  error,
  name,
  control
}) => {
  return (
    <div className={cn('flex flex-col items-start gap-2 self-stretch', className)}>
      {/* Label */}
      <div className="flex items-center gap-1">
        <label className="text-[#141C25] font-inter text-sm font-medium leading-5">
          {label}
        </label>
        {required && (
          <span className="text-red-500 text-sm">*</span>
        )}
      </div>
      
      {/* Select */}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select.Root value={field.value} onValueChange={field.onChange}>
            <Select.Trigger
              className={cn(
                'flex px-3 py-2 w-full justify-between items-center rounded border bg-white shadow-sm',
                'text-[#141C25] font-inter text-base font-normal leading-6',
                'focus:outline-none focus:ring-2 focus:ring-[#005EB8] focus:border-transparent',
                'data-[placeholder]:text-[#97A1AF]',
                error ? 'border-red-500' : 'border-[#E4E7EC]'
              )}
            >
              <Select.Value placeholder={placeholder} />
              <Select.Icon asChild>
                <ChevronDown className="w-5 h-5 text-[#637083]" />
              </Select.Icon>
            </Select.Trigger>
            
            <Select.Portal>
              <Select.Content
                className="overflow-hidden bg-white rounded-xl border border-[#E4E7EC] shadow-lg z-50"
                position="popper"
                sideOffset={4}
              >
                <Select.Viewport className="p-2">
                  {options.map((option) => (
                    <Select.Item
                      key={option.value}
                      value={option.value}
                      className={cn(
                        'relative flex items-center px-4 py-2 rounded cursor-pointer',
                        'text-[#344051] font-inter text-sm font-normal leading-5',
                        'hover:bg-[#F9FAFB] focus:bg-[#F9FAFB] focus:outline-none',
                        'data-[state=checked]:bg-[#EDF5FF] data-[state=checked]:text-[#005EB8]'
                      )}
                    >
                      <Select.ItemText>{option.label}</Select.ItemText>
                      <Select.ItemIndicator className="absolute right-2">
                        <Check className="w-4 h-4" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        )}
      />
      
      {/* Error message */}
      {error && (
        <div className="text-red-500 text-xs font-normal">
          {error}
        </div>
      )}
    </div>
  )
}
