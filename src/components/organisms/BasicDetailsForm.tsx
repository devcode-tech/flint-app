'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Form from '@radix-ui/react-form'
import { FormInput } from '@/components/atoms/FormInput'
import { FormSelect } from '@/components/atoms/FormSelect'
import { cn } from '@/lib/utils'
import { basicDetailsSchema, contestTypeOptions, type BasicDetailsFormData } from '@/schemas/contestSchema'

interface BasicDetailsFormProps {
  onSubmit: (data: BasicDetailsFormData) => void
  defaultValues?: Partial<BasicDetailsFormData>
  className?: string
}

export const BasicDetailsForm: React.FC<BasicDetailsFormProps> = ({
  onSubmit,
  defaultValues,
  className
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<BasicDetailsFormData>({
    resolver: zodResolver(basicDetailsSchema),
    defaultValues: {
      name: '',
      contestType: '',
      startDate: '',
      endDate: '',
      ...defaultValues
    }
  })

  return (
    <div className={cn('h-full flex flex-col bg-white rounded-lg border border-[#E4E7EC] overflow-hidden', className)}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 lg:p-6 border-b border-[#E4E7EC]">
        <div className="flex flex-col gap-2">
          <h2 className="text-[#141C25] font-inter text-lg lg:text-xl font-semibold">
            Basic Details
          </h2>
          <p className="text-[#344051] font-inter text-sm leading-5">
            Enter the basic information for your contest
          </p>
        </div>
      </div>
        
        {/* Form */}
        <div className="flex-1 overflow-auto p-4 lg:p-6">
          <Form.Root className="flex flex-col gap-4 lg:gap-6 h-full" onSubmit={handleSubmit(onSubmit)}>
          {/* Contest Name */}
          <FormInput
            name="name"
            label="Name of the Contest"
            placeholder="Enter contest name"
            required
            registration={register('name')}
            error={errors.name?.message}
          />
          
          {/* Contest Type */}
          <FormSelect
            name="contestType"
            label="Contest Type"
            placeholder="Select contest type"
            options={contestTypeOptions}
            required
            control={control}
            error={errors.contestType?.message}
          />
          
          {/* Contest Start Date */}
          <FormInput
            name="startDate"
            label="Contest Start Date"
            type="date"
            required
            registration={register('startDate')}
            error={errors.startDate?.message}
          />
          
          {/* Contest End Date */}
          <FormInput
            name="endDate"
            label="Contest End Date"
            type="date"
            required
            registration={register('endDate')}
            error={errors.endDate?.message}
          />
          
            {/* Submit button - hidden, form will be submitted by parent */}
            <button type="submit" className="hidden" disabled={isSubmitting} />
          </Form.Root>
        </div>
    </div>
  )
}
