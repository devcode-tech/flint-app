'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import FormDropdown from '@/components/atoms/FormDropdown'

const targetingSchema = z.object({
  audienceSegment: z.string().min(1, 'Audience segment is required'),
})

type TargetingFormData = z.infer<typeof targetingSchema>

interface TargetingFormProps {
  onSubmit: (data: TargetingFormData) => void
  className?: string
}

const TargetingForm: React.FC<TargetingFormProps> = ({ onSubmit, className }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    clearErrors,
  } = useForm<TargetingFormData>({
    resolver: zodResolver(targetingSchema),
    mode: 'onChange',
    defaultValues: {
      audienceSegment: '',
    },
  })

  const watchedValues = watch()

  const handleFormSubmit = (data: TargetingFormData) => {
    onSubmit(data)
  }

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
      <div className="flex flex-col gap-2 mb-4">
        <h2 className="text-[#141C25] font-inter text-xl font-semibold leading-8 tracking-[-0.4px]">
          Targeting
        </h2>
        <p className="text-[#344051] font-inter text-sm font-normal leading-5 capitalize">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </p>
        
        {/* Divider */}
        <div className="flex h-0 justify-center items-center self-stretch mt-2">
          <div className="w-full h-px bg-[#E4E7EC]"></div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col flex-1" noValidate>
        <div className="flex flex-col gap-2 flex-1">
          {/* Input Field Header */}
          <div className="flex justify-between items-start self-stretch">
            {/* Label */}
            <div className="flex items-center gap-1">
              <label className="text-[#141C25] font-inter text-sm font-medium leading-5">
                Choose Audience Segment
              </label>
            </div>
            
            {/* Create New Segment Button */}
            <button
              type="button"
              onClick={handleCreateNewSegment}
              className="flex justify-center items-center gap-2 rounded bg-white hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-5 h-5 text-[#005EB8]" strokeWidth={1.5} />
              <span className="text-[#005EB8] text-center font-inter text-sm font-medium leading-5 capitalize">
                Create New Segment
              </span>
            </button>
          </div>

          {/* Dropdown Input */}
          <div className="flex flex-col gap-2">
            <FormDropdown
              name="audienceSegment"
              control={control}
              label=""
              placeholder="Smart Audience Segment"
              options={audienceSegmentOptions}
              error={errors.audienceSegment?.message}
              onFocus={() => clearErrors('audienceSegment')}
              required
            />
          </div>
        </div>

        {/* Submit Button - Hidden as navigation is handled by parent */}
        <button type="submit" className="hidden">
          Submit
        </button>
      </form>
    </div>
  )
}

export default TargetingForm
