'use client'

import React, { useState, useRef } from 'react'
import { Ticket } from 'lucide-react'
import { Breadcrumb } from '@/components/molecules/Breadcrumb'
import { Stepper } from '@/components/molecules/Stepper'
import { BasicDetailsForm } from '@/components/organisms/BasicDetailsForm'
import { ContestPreview } from '@/components/organisms/ContestPreview'
import ActionsForm from '@/components/organisms/ActionsForm'
import PostCaptureForm from '@/components/organisms/PostCaptureForm'
import TargetingForm from '@/components/organisms/TargetingForm'
import { cn } from '@/lib/utils'
import type { BasicDetailsFormData } from '@/schemas/contestSchema'

interface ContestFormStep {
  id: string
  title: string
  status: 'completed' | 'current' | 'upcoming'
}

const steps: ContestFormStep[] = [
  { id: 'basic-details', title: 'Basic Details', status: 'current' },
  { id: 'create-form', title: 'Create Form', status: 'upcoming' },
  { id: 'actions', title: 'Actions', status: 'upcoming' },
  { id: 'post-capture', title: 'Post Capture', status: 'upcoming' },
  { id: 'targeting', title: 'Targeting', status: 'upcoming' }
]

// Define types for form data
interface ActionsFormData {
  rewardType: string
  chooseReward: string
}

interface PostCaptureFormData {
  behaviour: string
  autoclose: string
  title: string
  description: string
  url: string
}

interface TargetingFormData {
  audienceSegment: string
}

export const CreateContestPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [basicDetailsData, setBasicDetailsData] = useState<BasicDetailsFormData | null>(null)
  const [actionsData, setActionsData] = useState<ActionsFormData | null>(null)
  const [postCaptureData, setPostCaptureData] = useState<PostCaptureFormData | null>(null)
  const [targetingData, setTargetingData] = useState<TargetingFormData | null>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const handleBasicDetailsSubmit = (data: BasicDetailsFormData) => {
    setBasicDetailsData(data)
    setCurrentStep(1)
    console.log('Basic Details submitted:', data)
  }

  const handleActionsSubmit = (data: ActionsFormData) => {
    setActionsData(data)
    setCurrentStep(3)
    console.log('Actions submitted:', data)
  }

  const handlePostCaptureSubmit = (data: PostCaptureFormData) => {
    setPostCaptureData(data)
    setCurrentStep(4)
    console.log('Post Capture submitted:', data)
  }

  const handleTargetingSubmit = (data: TargetingFormData) => {
    setTargetingData(data)
    console.log('Targeting submitted:', data)
    console.log('Contest creation completed!')
    // Here you would typically submit all the form data to your backend
    console.log('All form data:', {
      basicDetails: basicDetailsData,
      actions: actionsData,
      postCapture: postCaptureData,
      targeting: data
    })
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleNext = () => {
    if (currentStep === 0 || currentStep === 2 || currentStep === 3 || currentStep === 4) {
      // Trigger form submission for steps with forms
      const submitButton = formRef.current?.querySelector('button[type="submit"]') as HTMLButtonElement
      if (submitButton) {
        submitButton.click()
      }
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const breadcrumbItems = [
    {
      label: 'Contests',
      href: '/contests',
      icon: <Ticket className="w-6 h-6 text-[#141C25]" />
    }
  ]

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between md:items-center px-4 lg:px-6 py-4 lg:py-5 border-b border-[#E4E7EC] flex-shrink-0">
          {/* Top row on mobile: Breadcrumb and Action Buttons */}
          <div className="flex justify-between items-center md:contents">
            {/* Breadcrumb */}
            <div className="flex-shrink-0">
              <Breadcrumb items={breadcrumbItems} />
            </div>
            
            {/* Action Buttons - shown on mobile in top row */}
            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 md:order-3">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={cn(
                  'flex px-2 md:px-3 lg:px-4 py-2 justify-center items-center gap-2 rounded border transition-colors text-xs lg:text-sm font-medium',
                  currentStep === 0
                    ? 'border-[#E4E7EC] text-[#97A1AF] cursor-not-allowed'
                    : 'border-[#005EB8] text-[#005EB8] hover:bg-[#005EB8] hover:text-white'
                )}
              >
                Previous
              </button>
              
              <button
                onClick={handleNext}
                className="flex px-2 md:px-3 lg:px-4 py-2 justify-center items-center gap-2 rounded bg-[#005EB8] hover:bg-[#004A94] transition-colors text-xs lg:text-sm font-medium text-white"
              >
                {currentStep === 4 ? 'Complete Contest' : currentStep === 5 ? 'Launch Contest' : 'Next Step'}
              </button>
            </div>
          </div>
          
          {/* Stepper - centered on mobile (bottom row), centered between breadcrumb and buttons on desktop */}
          <div className="flex justify-center md:flex-1 md:px-4 md:order-2">
            <Stepper steps={steps} />
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-6 min-h-0">
          {/* Form Section */}
          <div className="flex-1 lg:flex-[2] min-h-0">
            {/* Step 1: Basic Details */}
            {currentStep === 0 && (
              <div ref={formRef} className="h-full">
                <BasicDetailsForm
                  onSubmit={handleBasicDetailsSubmit}
                  defaultValues={basicDetailsData || undefined}
                />
              </div>
            )}
            
            {/* Step 2: Create Form - Coming Soon */}
            {currentStep === 1 && (
              <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6">
                <div className="text-[#637083] text-lg font-medium mb-2">
                  Step 2 - Create Form (Coming Soon)
                </div>
                <div className="text-[#97A1AF] text-sm text-center mb-4">
                  This step will be implemented in the next phase
                </div>
              </div>
            )}
            
            {/* Step 3: Actions */}
            {currentStep === 2 && (
              <div ref={formRef} className="h-full">
                <ActionsForm
                  onSubmit={handleActionsSubmit}
                />
              </div>
            )}
            
            {/* Step 4: Post Capture */}
            {currentStep === 3 && (
              <div ref={formRef} className="h-full">
                <PostCaptureForm
                  onSubmit={handlePostCaptureSubmit}
                />
              </div>
            )}
            
            {/* Step 5: Targeting */}
            {currentStep === 4 && (
              <div ref={formRef} className="h-full">
                <TargetingForm
                  onSubmit={handleTargetingSubmit}
                />
              </div>
            )}
            
            {/* Completion Summary - Show after all steps are completed */}
            {currentStep === 5 && (
              <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6">
                <div className="text-[#005EB8] text-2xl font-semibold mb-4">
                  🎉 Contest Created Successfully!
                </div>
                <div className="text-[#637083] text-lg font-medium mb-2">
                  Your contest has been created and is ready to launch
                </div>
                <div className="text-[#97A1AF] text-sm text-center mb-6">
                  Review the summary below or navigate back to make any changes
                </div>
                {/* Show all collected data */}
                <div className="w-full max-w-2xl space-y-4">
                  {basicDetailsData && (
                    <div className="p-4 bg-white rounded-lg border">
                      <h4 className="text-sm font-medium text-[#344051] mb-2">Basic Details:</h4>
                      <pre className="text-xs text-[#637083] overflow-auto max-h-32">
                        {JSON.stringify(basicDetailsData, null, 2)}
                      </pre>
                    </div>
                  )}
                  {actionsData && (
                    <div className="p-4 bg-white rounded-lg border">
                      <h4 className="text-sm font-medium text-[#344051] mb-2">Actions:</h4>
                      <pre className="text-xs text-[#637083] overflow-auto max-h-32">
                        {JSON.stringify(actionsData, null, 2)}
                      </pre>
                    </div>
                  )}
                  {postCaptureData && (
                    <div className="p-4 bg-white rounded-lg border">
                      <h4 className="text-sm font-medium text-[#344051] mb-2">Post Capture:</h4>
                      <pre className="text-xs text-[#637083] overflow-auto max-h-32">
                        {JSON.stringify(postCaptureData, null, 2)}
                      </pre>
                    </div>
                  )}
                  {targetingData && (
                    <div className="p-4 bg-white rounded-lg border">
                      <h4 className="text-sm font-medium text-[#344051] mb-2">Targeting:</h4>
                      <pre className="text-xs text-[#637083] overflow-auto max-h-32">
                        {JSON.stringify(targetingData, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Preview Section */}
          <div className="lg:flex-1 min-h-0">
            <ContestPreview />
          </div>
        </div>
    </div>
  )
}
