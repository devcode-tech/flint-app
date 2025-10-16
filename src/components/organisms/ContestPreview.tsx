'use client'

import React, { memo } from 'react'
import { cn } from '@/lib/utils'
import { FormPreviewLive } from '@devcode-tech/form-builder'
import type { ContestFormData } from '@/components/organisms/ContestFormBuilder'

interface ContestPreviewProps {
  className?: string
  formData?: ContestFormData | null
  currentStep?: number
}

export const ContestPreview = memo<ContestPreviewProps>(({ className, formData, currentStep = 0 }) => {
  // Hide preview on form builder step (step 1) as it has its own preview
  if (currentStep === 1) {
    return null
  }

  // Show form preview if form has been created
  const hasFormFields = formData && formData.fields && formData.fields.length > 0

  return (
    <div className={cn('flex h-full flex-col rounded-xl bg-white overflow-auto', className)}>
      {hasFormFields ? (
        // Show actual form preview
        <div className="p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-[#141C25] mb-4">Contest Preview</h3>
          <FormPreviewLive
            fields={formData.fields}
            containers={formData.containers || []}
            formTitle={formData.formTitle || 'Contest Entry Form'}
            formDescription={formData.formDescription || ''}
            formDesign={formData.design || {}}
          />
        </div>
      ) : (
        // Show default preview from ContestViewPage
        <DefaultContestPreview />
      )}
    </div>
  )
}, (prevProps, nextProps) => {
  // Only re-render if formData or currentStep actually changed
  return (
    JSON.stringify(prevProps.formData) === JSON.stringify(nextProps.formData) &&
    prevProps.currentStep === nextProps.currentStep
  )
})

ContestPreview.displayName = 'ContestPreview'

// Default Contest Preview Component (from ContestViewPage)
const DefaultContestPreview: React.FC = () => {
  return (
    <div className="h-full p-6 bg-[#FAFBFC] flex flex-col items-center gap-6">
      {/* Header Section */}
      <div className="w-full text-center mb-4">
        <h3 className="text-lg font-semibold text-[#141C25] mb-2">Contest Preview</h3>
        <p className="text-sm text-[#637083]">Preview how your contest will appear to participants</p>
      </div>
      
      {/* Header Image Placeholder */}
      <div className="w-full h-48 bg-gradient-to-br from-[#E2F1FF] to-[#B8E0FF] rounded-xl flex-shrink-0 flex items-center justify-center border border-[#E4E7EC]">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/50 rounded-full mx-auto mb-3 flex items-center justify-center">
            <div className="w-8 h-8 bg-[#005EB8]/20 rounded-full"></div>
          </div>
          <p className="text-[#637083] text-sm font-medium">Header Image</p>
        </div>
      </div>
      
      {/* Form Fields Placeholders */}
      <div className="w-full max-w-[500px] flex flex-col gap-4">
        <div className="text-center mb-2">
          <p className="text-sm font-medium text-[#637083]">Entry Form Fields</p>
        </div>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="w-full h-[42px] bg-white rounded-lg border border-[#E4E7EC] shadow-sm flex items-center px-4"
          >
            <div className="w-2 h-2 bg-[#E4E7EC] rounded-full mr-3"></div>
            <div className="w-full h-2 bg-[#F2F2F2] rounded-full"></div>
          </div>
        ))}
        
        {/* Submit Button Placeholder */}
        <div className="w-full h-[42px] bg-[#005EB8] rounded-lg flex items-center justify-center mt-2">
          <span className="text-white text-sm font-semibold">Submit Entry</span>
        </div>
      </div>
      
      {/* Footer Image Placeholder */}
      <div className="w-full h-[100px] bg-gradient-to-br from-[#E2F1FF] to-[#B8E0FF] rounded-xl flex-shrink-0 mt-auto flex items-center justify-center border border-[#E4E7EC]">
        <p className="text-[#637083] text-sm font-medium">Footer Content</p>
      </div>
    </div>
  )
}
