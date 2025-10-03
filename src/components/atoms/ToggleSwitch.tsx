'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ToggleSwitchProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  className?: string
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked = false,
  onChange,
  size = 'small',
  disabled = false,
  className
}) => {
  const handleToggle = () => {
    if (!disabled && onChange) {
      onChange(!checked)
    }
  }

  const sizeClasses = {
    small: 'w-9 h-5 p-0.5',
    medium: 'w-11 h-6 p-0.5',
    large: 'w-14 h-7 p-1'
  }

  const circleClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-5 h-5'
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={disabled}
      className={cn(
        'relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        sizeClasses[size],
        checked ? 'bg-[#005EB8]' : 'bg-[#97A1AF]',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <span
        className={cn(
          'inline-block rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out',
          circleClasses[size],
          checked ? 'translate-x-4' : 'translate-x-0'
        )}
      />
    </button>
  )
}
