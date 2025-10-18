'use client'

import React from 'react'
import { Control, useFormContext } from 'react-hook-form'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import FormDropdown from '@/components/atoms/FormDropdown'
import type { CompleteContestData } from '@/schemas/contestSchema'

interface TargetingFormProps {
  control: Control<CompleteContestData>
  fieldPrefix: 'targeting'
  className?: string
}

const TargetingForm: React.FC<TargetingFormProps> = ({ control, fieldPrefix, className }) => {
  const { formState: { errors } } = useFormContext<CompleteContestData>() || { formState: { errors: {} } }

  const handleCreateNewSegment = () => {
    // Handle create new segment functionality
    console.log('Create new segment clicked')
  }

  const audienceSegmentOptions = [
    { value: 'smart-audience-segment', label: 'Smart Audience Segment' },
    { value: 'demographic-segment', label: 'Demographic Segment' },
    { value: 'behavioral-segment', label: 'Behavioral Segment' },
    { value: 'geographic-segment', label: 'Geographic Segment' },
    { value: 'psychographic-segment', label: 'Psychographic Segment' },
  ]

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-[#141C25] font-inter text-lg font-semibold leading-7">
          Targeting
        </h2>
        <p className="text-[#637083] font-inter text-sm font-normal leading-5">
          Select the audience segment for your contest
        </p>
      </div>

      {/* Form */}
      <div className="flex flex-col flex-1">
        <div className="flex flex-col gap-2 flex-1">
          {/* Input Field Header */}
          <div className="flex justify-between items-center self-stretch gap-4 flex-wrap">
            {/* Label */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <label className="text-[#141C25] font-inter text-sm font-medium leading-5 whitespace-nowrap">
                Choose Audience Segment
              </label>
              <span className="text-red-500 text-sm">*</span>
            </div>
            
            {/* Create New Segment Button */}
            <button
              type="button"
              onClick={handleCreateNewSegment}
              className="flex justify-center items-center gap-2 rounded bg-white hover:bg-gray-50 transition-colors flex-shrink-0"
            >
              <Plus className="w-5 h-5 text-[#005EB8]" strokeWidth={1.5} />
              <span className="text-[#005EB8] text-center font-inter text-sm font-medium leading-5 capitalize whitespace-nowrap">
                Create New Segment
              </span>
            </button>
          </div>

          {/* Dropdown Input */}
          <div className="flex flex-col gap-2">
            <FormDropdown
              name={`${fieldPrefix}.audienceSegment`}
              control={control}
              label=""
              placeholder="Smart Audience Segment"
              options={audienceSegmentOptions}
              error={errors.targeting?.audienceSegment?.message}
              // required
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TargetingForm
