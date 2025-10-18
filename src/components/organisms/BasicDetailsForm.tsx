'use client'

import React from 'react'
import { Control, useFormContext } from 'react-hook-form'
import { FormInput } from '@/components/atoms/FormInput'
import { FormSelect } from '@/components/atoms/FormSelect'
import { cn } from '@/lib/utils'
import { contestTypeOptions, type CompleteContestData } from '@/schemas/contestSchema'

interface BasicDetailsFormProps {
  control: Control<CompleteContestData>
  fieldPrefix: 'basicDetails'
  className?: string
  isDisabled?: boolean
}

export const BasicDetailsForm: React.FC<BasicDetailsFormProps> = ({
  control,
  fieldPrefix,
  className,
  isDisabled
}) => {
  const { formState: { errors } } = useFormContext<CompleteContestData>() || { formState: { errors: {} } }

  return (
    <div className={cn('h-full flex flex-col overflow-auto p-1', className)}>
      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-[#141C25] font-inter text-lg font-semibold leading-7">
          Basic Details
        </h2>
        <p className="text-[#637083] font-inter text-sm font-normal leading-5">
          Enter the basic information for your contest
        </p>
      </div>
        
        {/* Form */}
        <div className="flex-1">
          <div className="flex flex-col gap-6 pb-2">
          {/* Contest Name */}
          <FormInput
            name={`${fieldPrefix}.name`}
            control={control}
            label="Name of the Contest"
            placeholder="Enter contest name"
            required
            error={errors.basicDetails?.name?.message}
          />
          
          {/* Contest Type */}
          <FormSelect
            name={`${fieldPrefix}.contestType`}
            label="Contest Type"
            placeholder="Select contest type"
            options={contestTypeOptions}
            required
            control={control}
            error={errors.basicDetails?.contestType?.message}
          />
          
          {/* Contest Start Date */}
          <FormInput
            name={`${fieldPrefix}.startDate`}
            control={control}
            label="Contest Start Date"
            type="date"
            required
            disabled = {isDisabled}
            error={errors.basicDetails?.startDate?.message}
          />
          
          {/* Contest End Date */}
          <FormInput
            name={`${fieldPrefix}.endDate`}
            control={control}
            label="Contest End Date"
            type="date"
            required
            disabled = {isDisabled}
            error={errors.basicDetails?.endDate?.message}
          />
        </div>
      </div>
    </div>
  )
}
