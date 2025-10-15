'use client'

import React from 'react'
import { Control, useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'
import FormDropdown from '@/components/atoms/FormDropdown'
import FormInput from '@/components/atoms/FormInput'
import type { CompleteContestData } from '@/schemas/contestSchema'

interface PostCaptureFormProps {
  control: Control<CompleteContestData>
  fieldPrefix: 'postCapture'
  className?: string
}

const PostCaptureForm: React.FC<PostCaptureFormProps> = ({ control, fieldPrefix, className }) => {
  const { formState: { errors } } = useFormContext<CompleteContestData>() || { formState: { errors: {} } }

  const behaviourOptions = [
    { value: 'thank-you', label: 'Thank You' },
    { value: 'redirect', label: 'Redirect' },
    { value: 'popup', label: 'Popup' },
    { value: 'modal', label: 'Modal' },
  ]

  const autocloseOptions = [
    { value: 'after-5-seconds', label: 'After 5 seconds' },
    { value: 'after-10-seconds', label: 'After 10 seconds' },
    { value: 'after-15-seconds', label: 'After 15 seconds' },
    { value: 'manual', label: 'Manual' },
  ]

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-[#141C25] font-inter text-lg font-semibold leading-7">
          Post Capture
        </h2>
        <p className="text-[#637083] font-inter text-sm font-normal leading-5">
          Define what happens after a user submits the contest form
        </p>
      </div>

      {/* Form */}
      <div className="flex flex-col flex-1">
        <div className="flex flex-col gap-6 flex-1">
          {/* Behaviour */}
          <div className="flex flex-col gap-2">
            <FormDropdown
              name={`${fieldPrefix}.behaviour`}
              control={control}
              label="Behaviour"
              placeholder="Thank You"
              options={behaviourOptions}
              error={errors.postCapture?.behaviour?.message}
              required
            />
          </div>

          {/* Autoclose */}
          <div className="flex flex-col gap-2">
            <FormDropdown
              name={`${fieldPrefix}.autoclose`}
              control={control}
              label="Autoclose"
              placeholder="After 5 seconds"
              options={autocloseOptions}
              error={errors.postCapture?.autoclose?.message}
              required
            />
          </div>

          {/* Title */}
          <div className="flex flex-col gap-2">
            <FormInput
              name={`${fieldPrefix}.title`}
              control={control}
              label="Title"
              placeholder="Thank You Title"
              error={errors.postCapture?.title?.message}
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <FormInput
              name={`${fieldPrefix}.description`}
              control={control}
              label="Description"
              placeholder="Description"
              error={errors.postCapture?.description?.message}
              required
              multiline
              rows={4}
            />
          </div>

          {/* URL */}
          <div className="flex flex-col gap-2">
            <FormInput
              name={`${fieldPrefix}.url`}
              control={control}
              label="URL"
              placeholder="https://"
              error={errors.postCapture?.url?.message}
              required
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCaptureForm
