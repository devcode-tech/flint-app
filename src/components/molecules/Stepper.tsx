'use client'

import React from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  id: string
  title: string
  status?: 'completed' | 'current' | 'upcoming'
}

interface StepperProps {
  steps: Step[]
  currentStep?: number
  className?: string
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep = 0, className }) => {
  // Calculate status based on currentStep if not explicitly provided
  const getStepStatus = (index: number, step: Step): 'completed' | 'current' | 'upcoming' => {
    if (step.status) return step.status
    if (index < currentStep) return 'completed'
    if (index === currentStep) return 'current'
    return 'upcoming'
  }

  return (
    <div className={cn('flex items-center gap-1 lg:gap-2.5 overflow-x-auto', className)}>
      {steps.map((step, index) => {
        const status = getStepStatus(index, step)
        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-1 lg:gap-1.5 p-0 rounded-lg flex-shrink-0">
              {/* Badge */}
              <div
                className={cn(
                  'flex w-5 h-5 lg:w-6 lg:h-6 p-2.5 flex-col justify-center items-center gap-2.5 rounded-full flex-shrink-0',
                  status === 'current'
                    ? 'bg-[#E4E7EC]'
                    : status === 'completed'
                    ? 'bg-[#005EB8]'
                    : 'border border-[#E4E7EC]'
                )}
              >
                <div
                  className={cn(
                    'text-center font-inter text-xs lg:text-sm font-semibold leading-5 capitalize',
                    status === 'current'
                      ? 'text-[#141C25]'
                      : status === 'completed'
                      ? 'text-white'
                      : 'text-[#637083]'
                  )}
                >
                  {index + 1}
                </div>
              </div>
              
              {/* Step Title - Hidden on mobile */}
              <div
                className={cn(
                  'hidden sm:block text-center font-inter text-xs lg:text-sm font-medium leading-5 capitalize whitespace-nowrap',
                  status === 'current'
                    ? 'text-[#141C25]'
                    : status === 'completed'
                    ? 'text-[#141C25]'
                    : 'text-[#637083]'
                )}
              >
                {step.title}
              </div>
            </div>
            
            {/* Arrow separator (not for last item) */}
            {index < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-[#637083] flex-shrink-0" />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
