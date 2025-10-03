'use client'

import React from 'react'
import * as Form from '@radix-ui/react-form'
import * as Label from '@radix-ui/react-label'
import { cn } from '@/lib/utils'
import { UseFormRegisterReturn, Control, Controller } from 'react-hook-form'

interface FormInputProps {
  label: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'date'
  required?: boolean
  className?: string
  error?: string
  registration?: UseFormRegisterReturn
  name: string
  control?: Control<any>
  multiline?: boolean
  rows?: number
  onFocus?: () => void
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  placeholder,
  type = 'text',
  required = false,
  className,
  error,
  registration,
  name,
  control,
  multiline = false,
  rows = 3,
  onFocus
}) => {
  const inputClassName = cn(
    'flex px-3 py-2 w-full rounded border bg-white shadow-sm',
    'text-[#141C25] font-inter text-base font-normal leading-6',
    'placeholder:text-[#97A1AF] focus:outline-none focus:ring-2 focus:ring-[#005EB8] focus:border-transparent',
    error ? 'border-red-500' : 'border-[#E4E7EC]',
    multiline && 'resize-none'
  )

  if (control) {
    // When using with react-hook-form Controller, don't use Radix Form components
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
        
        {/* Input/Textarea */}
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            multiline ? (
              <textarea
                {...field}
                placeholder={placeholder}
                rows={rows}
                onFocus={onFocus}
                className={inputClassName}
              />
            ) : (
              <input
                {...field}
                type={type}
                placeholder={placeholder}
                onFocus={onFocus}
                className={inputClassName}
              />
            )
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

  // When using without react-hook-form, use Radix Form components
  return (
    <Form.Field className={cn('flex flex-col items-start gap-2 self-stretch', className)} name={name}>
      {/* Label */}
      <div className="flex items-center gap-1">
        <Form.Label asChild>
          <Label.Root className="text-[#141C25] font-inter text-sm font-medium leading-5">
            {label}
          </Label.Root>
        </Form.Label>
        {required && (
          <span className="text-red-500 text-sm">*</span>
        )}
      </div>
      
      {/* Input/Textarea */}
      <Form.Control asChild>
        {multiline ? (
          <textarea
            placeholder={placeholder}
            rows={rows}
            onFocus={onFocus}
            {...registration}
            className={inputClassName}
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            onFocus={onFocus}
            {...registration}
            className={inputClassName}
          />
        )}
      </Form.Control>
      
      {/* Error message */}
      {error && (
        <Form.Message className="text-red-500 text-xs font-normal">
          {error}
        </Form.Message>
      )}
    </Form.Field>
  )
}

export default FormInput
