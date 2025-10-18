'use client'

import React, { memo } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { FormPreviewLive } from '@devcode-tech/form-builder'
import type { ContestFormData } from '@/components/organisms/ContestFormBuilder'

interface ContestPreviewProps {
  className?: string
  formData?: ContestFormData | null
  currentStep?: number
}

export const ContestPreview = memo<ContestPreviewProps>(({ className, formData, currentStep = 0 }) => {
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

// Default Contest Preview Component - Shows SVG placeholder
const DefaultContestPreview: React.FC = () => {
  return (
    <div className="h-full p-6 bg-[#FAFBFC] flex flex-col items-center justify-center">
      <Image
        src="/List is empty 1.svg"
        alt="Contest preview placeholder"
        width={400}
        height={400}
        className="opacity-60"
      />
      <p className="text-[#97A1AF] text-sm mt-4 text-center">
        Your contest form will appear here
      </p>
    </div>
  )
}
