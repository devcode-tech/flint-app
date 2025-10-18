'use client'

import React, { useState, useRef, lazy, Suspense, useEffect, useMemo, useCallback } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Ticket, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Breadcrumb } from '@/components/molecules/Breadcrumb'
import { Stepper } from '@/components/molecules/Stepper'
import { BasicDetailsForm } from '@/components/organisms/BasicDetailsForm'
import { ContestPreview } from '@/components/organisms/ContestPreview'
import { PostCapturePreview } from '@/components/organisms/PostCapturePreview'
import { PostContestPreview } from '@/components/organisms/PostContestPreview'
import { cn } from '@/lib/utils'
import { completeContestSchema, type CompleteContestData } from '@/schemas/contestSchema'
import { debounce } from '@/lib/utils/debounce'
import { useFormSchema } from '@/hooks/useFormSchema'
import { generateFormId } from '@devcode-tech/form-builder'
import { useContestApi } from '@/hooks/useContestApi'
import { EmbedCodeSection } from './EmbedCodeSection'

// Lazy load heavy components
const ContestFormBuilder = lazy(() => import('@/components/organisms/ContestFormBuilder').then(mod => ({ default: mod.ContestFormBuilder })))
const ActionsForm = lazy(() => import('@/components/organisms/ActionsForm'))
const PostCaptureForm = lazy(() => import('@/components/organisms/PostCaptureForm'))
const PostContestForm = lazy(() => import('@/components/organisms/PostContestForm'))
const TargetingForm = lazy(() => import('@/components/organisms/TargetingForm'))

// Loading component
const FormLoading = () => (
  <div className="h-full flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 border-4 border-[#E4E7EC] border-t-[#005EB8] rounded-full animate-spin" />
      <p className="text-sm text-[#637083]">Loading...</p>
    </div>
  </div>
)

interface ContestFormStep {
  id: string
  title: string
  status?: 'completed' | 'current' | 'upcoming'
}

const steps: ContestFormStep[] = [
  { id: 'basic-details', title: 'Basic Details' },
  { id: 'create-form', title: 'Create Form' },
  { id: 'actions', title: 'Actions' },
  { id: 'post-capture', title: 'Post Capture' },
  { id: 'post-contest', title: 'After Contest Ends' },
  { id: 'targeting', title: 'Targeting' },
  { id: 'share', title: 'Share' }
]

// Types are now in schema

interface EditContestPageProps {
  contestId: string
}

export const EditContestPage: React.FC<EditContestPageProps> = ({ contestId }) => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingForm, setIsLoadingForm] = useState(false)
  const [savedDbFormId, setSavedDbFormId] = useState<string | null>(null)
  const [savedFormId, setSavedFormId] = useState<string | null>(null) // Embed ID for display
  const [contestName, setContestName] = useState<string>('') // Store contest name for header
  const formRef = useRef<HTMLDivElement>(null)
  const { fetchFormSchemaById, createFormSchema, updateFormSchema } = useFormSchema()
  const { fetchContest, updateContest } = useContestApi()

  // Single useForm instance for all contest data
  const form = useForm<CompleteContestData>({
    resolver: zodResolver(completeContestSchema),
    mode: 'onBlur', // Changed from onChange for better performance
    defaultValues: {
      basicDetails: {
        name: '',
        contestType: '',
        startDate: '',
        endDate: ''
      },
      formBuilder: {
        formId: undefined,
        formTitle: 'Contest Entry Form',
        formDescription: '',
        fields: [],
        containers: [],
        design: {}
      },
      actions: {
        rewardType: '',
        chooseReward: ''
      },
      postCapture: {
        behaviour: '',
        autoclose: '',
        title: '',
        description: '',
        url: ''
      },
      postContest: {
        content: ''
      },
      targeting: {
        audienceSegment: ''
      }
    }
  })

  const { watch, setValue, getValues, reset } = form

  // Watch form builder data for preview
  const formBuilderData = watch('formBuilder')
  
  // Watch post capture data for preview
  const postCaptureData = watch('postCapture')

  // Watch post contest data for preview
  const postContestData = watch('postContest')

  // Watch end date for post contest form
  const endDate = watch('basicDetails.endDate')

  // Debounced form builder update for better performance
  const debouncedSetFormBuilder = useMemo(
    () => debounce((data) => {
      setValue('formBuilder', data)
    }, 300),
    [setValue]
  )

  // Load form schema from database
  const loadFormSchemaFromDb = useCallback(async () => {
    console.log('getting into loadFormSchemaFromDb')
    if (!savedDbFormId) {
      console.log('No saved form ID to load')
      return
    }

    try {
      setIsLoadingForm(true)
      console.log('Loading form schema from database:', savedDbFormId)
      
      const formData = await fetchFormSchemaById(savedDbFormId)
      console.log('Form schema loaded successfully:', formData)
      
      if (formData) {
        console.log('Form schema loaded successfully:', formData)
        // Update the form builder data with fetched schema
        setValue('formBuilder', {
          formId: formData.formId,
          formTitle: formData.formTitle,
          formDescription: formData.formDescription,
          fields: formData.fields,
          containers: formData.containers,
          design: formData.design
        })
        // Also set the embed ID for display
        setSavedFormId(formData.formId || null)
      } else {
        console.warn('Form schema not found, will show empty form builder')
        setSavedDbFormId(null)
      }
    } catch (error) {
      console.error('Error loading form schema:', error)
      // Don't block - show empty form builder
      setSavedDbFormId(null)
    } finally {
      setIsLoadingForm(false)
    }
  }, [savedDbFormId, fetchFormSchemaById, setValue])

  // Load existing contest data
  useEffect(() => {
    const loadContestData = async () => {
      try {
        setIsLoading(true)
        console.log('Loading contest data for:', contestId)
        
        // Fetch contest data using API hook
        const contestData = await fetchContest(contestId)
        
        console.log('Contest data loaded:', contestData)
        
        // Helper function to format date for input
        const formatDateForInput = (dateString: string) => {
          if (!dateString) return ''
          // Extract just the date part (YYYY-MM-DD) from ISO string
          return dateString.split('T')[0]
        }
        
        // Pre-fill basic details from contest data
        setValue('basicDetails.name', contestData.name || '')
        setValue('basicDetails.contestType', contestData.contest_type || '')
        setValue('basicDetails.startDate', formatDateForInput(contestData.start_date))
        setValue('basicDetails.endDate', formatDateForInput(contestData.end_date))
        
        // Store contest name for header display
        setContestName(contestData.name || 'Untitled Contest')
        
        // Load actions data
        setValue('actions.rewardType', contestData.reward_type || '')
        setValue('actions.chooseReward', contestData.reward_option || '')
        
        // Load post capture data
        setValue('postCapture.behaviour', contestData.capture_behaviour || '')
        setValue('postCapture.autoclose', contestData.capture_autoclose || '')
        setValue('postCapture.title', contestData.post_capture_content || '')
        setValue('postCapture.description', '')
        setValue('postCapture.url', '')
        
        // Load post contest data
        setValue('postContest.content', contestData.end_contest || '')
        
        // Load targeting data
        if (contestData.audience_segments && contestData.audience_segments.length > 0) {
          setValue('targeting.audienceSegment', contestData.audience_segments[0] || '')
        }
        
        // Store form schema ID but don't load it yet (will load when user reaches step 2)
        if (contestData.form_schema_id) {
          console.log('Contest has form schema:', contestData.form_schema_id)
          setSavedDbFormId(contestData.form_schema_id)
        } else {
          console.log('Contest has no form schema yet - will create on first save')
          setSavedDbFormId(null)
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading contest:', error)
        alert('Failed to load contest data')
        setIsLoading(false)
      }
    }

    loadContestData()
  }, [contestId, setValue, fetchContest])

  // Load form schema when savedDbFormId changes (on mount if exists)
  useEffect(() => {
    if (savedDbFormId && !isLoading) {
      loadFormSchemaFromDb()
    }
  }, [savedDbFormId, isLoading, loadFormSchemaFromDb])

  // Save or update form schema to database
  const saveFormSchema = async () => {
    try {
      const formBuilderData = getValues('formBuilder')
      const { formTitle, formDescription, fields, containers, design } = formBuilderData

      let dbFormId = savedDbFormId

      if (savedDbFormId) {
        // UPDATE existing form schema using API hook
        console.log('Updating existing form schema:', savedDbFormId)
        
        const data = await updateFormSchema(savedDbFormId, {
          title: formTitle,
          description: formDescription,
          fields: fields,
          containers: containers,
          design: design
        })

        dbFormId = data.id
        setSavedFormId(data.form_id) // Update embed ID
        console.log('Form updated successfully:', data)
      } else {
        // CREATE new form schema using API hook
        console.log('Creating new form schema')
        
        const embedId = generateFormId()
        
        const data = await createFormSchema({
          form_id: embedId,
          contest_id: contestId,
          title: formTitle,
          description: formDescription,
          fields: fields,
          containers: containers,
          design: design
        })

        dbFormId = data.id
        setSavedFormId(data.form_id) // Set embed ID
        console.log('Form created successfully:', data)

        // Update contest record with form_schema_id using API hook
        await updateContest(contestId, { form_schema_id: dbFormId || undefined })
      }

      setSavedDbFormId(dbFormId)
      setValue('formBuilder.formId', dbFormId || undefined)
      
      return dbFormId
    } catch (error) {
      console.error('Error saving form:', error)
      alert('Error saving form to database. Please try again.')
      return null
    }
  }

  // Update contest data for any step using API hook
  const updateContestData = async (stepData: any, stepName: string) => {
    try {
      await updateContest(contestId, stepData)
      console.log(`Contest ${stepName} updated successfully`)
      return true
    } catch (error) {
      console.error(`Error updating contest ${stepName}:`, error)
      alert(`Error updating contest: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return false
    }
  }

  // Handle step navigation with validation
  const handleStepSubmit = async (step: number) => {
    let isValid = false

    switch (step) {
      case 0: // Basic Details - Update contest
        isValid = await form.trigger('basicDetails')
        if (isValid) {
          console.log('Basic Details validated:', getValues('basicDetails'))
          const basicDetails = getValues('basicDetails')
          const updated = await updateContestData({
            name: basicDetails.name,
            contest_type: basicDetails.contestType,
            start_date: basicDetails.startDate,
            end_date: basicDetails.endDate,
          }, 'basic details')
          if (updated) {
            setCurrentStep(1)
          }
        }
        break

      case 1: // Form Builder - Save/Update form schema
        console.log('Form Builder data:', getValues('formBuilder'))
        const formId = await saveFormSchema()
        if (formId) {
          setCurrentStep(2)
        }
        break

      case 2: // Actions - Save to database
        isValid = await form.trigger('actions')
        if (isValid) {
          const actions = getValues('actions')
          console.log('Actions validated:', actions)
          const updated = await updateContestData({
            reward_type: actions.rewardType,
            reward_option: actions.chooseReward,
          }, 'actions')
          if (updated) {
            setCurrentStep(3)
          }
        }
        break

      case 3: // Post Capture - Save to database
        isValid = await form.trigger('postCapture')
        if (isValid) {
          const postCapture = getValues('postCapture')
          console.log('Post Capture validated:', postCapture)
          const updated = await updateContestData({
            capture_behaviour: postCapture.behaviour,
            capture_autoclose: postCapture.autoclose,
            post_capture_content: postCapture.title, // Store markdown content in post_capture_content
          }, 'post capture')
          if (updated) {
            setCurrentStep(4)
          }
        }
        break

      case 4: // Post Contest (optional)
        // No validation needed as it's optional
        const postContest = getValues('postContest')
        // Only save if content is provided
        if (postContest.content && postContest.content.trim() !== '') {
          await updateContestData({
            end_contest: postContest.content, // Store markdown content in end_contest
          }, 'post contest')
        }
        // Move to next step regardless of whether content was provided
        setCurrentStep(5)
        break

      case 5: // Targeting - Save to database
        isValid = await form.trigger('targeting')
        if (isValid) {
          const targeting = getValues('targeting')
          console.log('Targeting validated:', targeting)
          const updated = await updateContestData({
            audience_segments: [targeting.audienceSegment],
          }, 'targeting')
          if (updated) {
            setCurrentStep(6) // Move to Share step
          }
        }
        break

      case 6: // Share - Final step, redirect to contest view
        await handleFinalSubmit()
        break
    }
  }

  // Final submission - redirect to contest view
  const handleFinalSubmit = async () => {
    const allData = getValues()
    console.log('Contest update completed!')
    console.log('All updated form data:', allData)

    // All data has been saved incrementally at each step
    // Redirect back to contest view page
    router.push(`/contests/${contestId}`)
  }

  const handlePrevious = async () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleNext = async () => {
    await handleStepSubmit(currentStep)
  }

  const handleCancel = () => {
    router.push(`/contests/${contestId}`)
  }

  const breadcrumbItems = [
    {
      label: 'Contests',
      href: '/contests',
      icon: <Ticket className="w-6 h-6 text-[#141C25]" />
    },
    {
      label: 'Edit Contest',
      href: `/contests/${contestId}/edit`
    }
  ]

  if (isLoading) {
    return <FormLoading />
  }

  return (
    <FormProvider {...form}>
      <div className="h-full flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex flex-col gap-3 px-4 lg:px-6 py-4 lg:py-5 border-b border-[#E4E7EC] flex-shrink-0">
          {/* Top Row: Breadcrumb and Action Buttons */}
          <div className="flex justify-between items-center gap-4">
            {/* Left: Back Button + Breadcrumb + Contest ID */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                onClick={handleCancel}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#E4E7EC] hover:bg-[#F9FAFB] transition-colors flex-shrink-0"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4 text-[#637083]" />
              </button>
              <Breadcrumb items={breadcrumbItems} />
              {contestName && (
                <span className="text-sm text-[#637083] font-medium truncate">
                  ({contestName})
                </span>
              )}
            </div>
            
            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={cn(
                  'hidden md:flex px-3 lg:px-4 py-2 justify-center items-center gap-2 rounded border transition-colors text-sm font-medium',
                  currentStep === 0
                    ? 'border-[#E4E7EC] text-[#97A1AF] cursor-not-allowed'
                    : 'border-[#005EB8] text-[#005EB8] hover:bg-[#005EB8] hover:text-white'
                )}
              >
                Previous
              </button>
              
              <button
                onClick={handleNext}
                className="flex px-3 lg:px-4 py-2 justify-center items-center gap-2 rounded bg-[#005EB8] hover:bg-[#004A94] transition-colors text-sm font-medium text-white"
              >
                {currentStep === 6 ? 'View Contest' : currentStep === 5 ? 'Finish' : 'Next Step'}
              </button>
            </div>
          </div>
          
          {/* Bottom Row: Stepper */}
          <div className="flex justify-center w-full">
            <Stepper steps={steps} currentStep={currentStep} />
          </div>
        </div>
        
        {/* Content Area */}
        <div className={cn(
          "flex-1 flex gap-4 lg:gap-6 min-h-0",
          currentStep === 1 ? "flex-col p-0" : "flex-col lg:flex-row p-4 lg:p-6"
        )}>
          {/* Form Section */}
          <div className={cn(
            "flex-1 min-h-0",
            currentStep === 1 ? "w-full" : "lg:flex-[0.55]"
          )}>
            {/* Step 1: Basic Details */}
            {currentStep === 0 && (
              <div ref={formRef} className="h-full">
                <BasicDetailsForm
                  control={form.control}
                  fieldPrefix="basicDetails"
                  isDisabled={true}
                />
              </div>
            )}
            
            {/* Step 2: Create Form */}
            {currentStep === 1 && (
              <div ref={formRef} className="h-full w-full">
                {isLoadingForm ? (
                  <FormLoading />
                ) : (
                  <Suspense fallback={<FormLoading />}>
                    <ContestFormBuilder
                      onDataChange={debouncedSetFormBuilder}
                      defaultValues={formBuilderData}
                      isEditMode={true}
                      contestId={contestId}
                    />
                  </Suspense>
                )}
              </div>
            )}
            
            {/* Step 3: Actions */}
            {currentStep === 2 && (
              <div ref={formRef} className="h-full">
                <Suspense fallback={<FormLoading />}>
                  <ActionsForm
                    control={form.control}
                    fieldPrefix="actions"
                  />
                </Suspense>
              </div>
            )}
            
            {/* Step 4: Post Capture */}
            {currentStep === 3 && (
              <div ref={formRef} className="h-full">
                <Suspense fallback={<FormLoading />}>
                  <PostCaptureForm
                    control={form.control}
                    fieldPrefix="postCapture"
                  />
                </Suspense>
              </div>
            )}
            
            {/* Step 5: Post Contest */}
            {currentStep === 4 && (
              <div ref={formRef} className="h-full">
                <Suspense fallback={<FormLoading />}>
                  <PostContestForm
                    control={form.control}
                    fieldPrefix="postContest"
                    endDate={endDate}
                  />
                </Suspense>
              </div>
            )}
            
            {/* Step 6: Targeting */}
            {currentStep === 5 && (
              <div ref={formRef} className="h-full">
                <Suspense fallback={<FormLoading />}>
                  <TargetingForm
                    control={form.control}
                    fieldPrefix="targeting"
                  />
                </Suspense>
              </div>
            )}
            
            {/* Step 7: Share - Show embed code */}
            {currentStep === 6 && (
              <div ref={formRef} className="h-full flex flex-col">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold text-[#141C25]">
                      🎉 Contest Updated Successfully!
                    </h2>
                    <p className="text-sm text-[#637083] mt-1">
                      Your contest has been updated and is ready to share
                    </p>
                  </div>
                  
                  <EmbedCodeSection embedId={savedFormId} />
                </div>
              </div>
            )}
          </div>
          
          {/* Preview Section - Hidden on form builder step (step 1) */}
          {currentStep !== 1 && (
            <div className="lg:flex-[0.45] min-h-0">
              {currentStep === 3 ? (
                // Show Post Capture Preview on step 3 (Post Capture)
                <PostCapturePreview 
                  title={postCaptureData.title}
                  description={postCaptureData.description}
                  url={postCaptureData.url}
                />
              ) : currentStep === 4 ? (
                // Show Post Contest Preview on step 4 (After Contest Ends)
                <PostContestPreview
                  content={postContestData.content}
                />
              ) : (
                // Show SVG placeholder on all other steps (0, 2, 5, 6)
                <ContestPreview formData={null} currentStep={currentStep} />
              )}
            </div>
          )}
        </div>
      </div>
    </FormProvider>
  )
}
