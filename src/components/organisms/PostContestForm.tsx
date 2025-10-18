'use client'

import React from 'react'
import { Control, useFormContext, Controller } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { EnhancedRichTextEditor } from '@/components/atoms/EnhancedRichTextEditor'
import type { CompleteContestData } from '@/schemas/contestSchema'

interface PostContestFormProps {
  control: Control<CompleteContestData>
  fieldPrefix: 'postContest'
  className?: string
  endDate?: string
}

const PostContestForm: React.FC<PostContestFormProps> = ({ 
  control, 
  fieldPrefix, 
  className,
  endDate 
}) => {
  const { formState: { errors } } = useFormContext<CompleteContestData>() || { formState: { errors: {} } }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'the end date'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-[#141C25] font-inter text-lg font-semibold leading-7">
          Post-Contest Content
        </h2>
        <p className="text-[#637083] font-inter text-sm font-normal leading-5">
          Define what participants will see after the contest ends
        </p>
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-[#F0F7FF] border border-[#B3D9FF] rounded-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-[#005EB8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-[#005EB8] text-sm font-medium leading-5">
              Contest ends on {formatDate(endDate)}
            </p>
            <p className="text-[#637083] text-xs mt-1 leading-5">
              The content you provide here will be displayed on the embedded form after the contest concludes. 
              This is optional and can be used to thank participants, announce winners, or provide next steps.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col flex-1">
        <div className="flex flex-col gap-6 flex-1">
          {/* Post-Contest Message */}
          <div className="flex flex-col gap-2">
            <Controller
              name={`${fieldPrefix}.content`}
              control={control}
              render={({ field }) => (
                <EnhancedRichTextEditor
                  value={field.value || ''}
                  onChange={field.onChange}
                  label="Post-Contest Message"
                  placeholder="Enter the message participants will see after the contest ends..."
                  error={errors.postContest?.content?.message}
                  minHeight="300px"
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostContestForm
