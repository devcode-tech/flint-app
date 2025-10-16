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
import { cn } from '@/lib/utils'
import { completeContestSchema, type CompleteContestData } from '@/schemas/contestSchema'
import { debounce } from '@/lib/utils/debounce'
import { supabase } from '@/lib/supabase/client'
import { useFormSchema } from '@/hooks/useFormSchema'
import { generateFormId } from '@devcode-tech/form-builder'

// Lazy load heavy components
const ContestFormBuilder = lazy(() => import('@/components/organisms/ContestFormBuilder').then(mod => ({ default: mod.ContestFormBuilder })))
const ActionsForm = lazy(() => import('@/components/organisms/ActionsForm'))
const PostCaptureForm = lazy(() => import('@/components/organisms/PostCaptureForm'))
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
  { id: 'targeting', title: 'Targeting' }
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
  const formRef = useRef<HTMLDivElement>(null)
  const { fetchFormSchemaById } = useFormSchema()

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
      targeting: {
        audienceSegment: ''
      }
    }
  })

  const { watch, setValue, getValues, reset } = form

  // Watch form builder data for preview
  const formBuilderData = watch('formBuilder')

  // Debounced form builder update for better performance
  const debouncedSetFormBuilder = useMemo(
    () => debounce((data) => {
      setValue('formBuilder', data)
    }, 300),
    [setValue]
  )

  // Load form schema from database
  const loadFormSchemaFromDb = useCallback(async (formSchemaId: string) => {
    try {
      setIsLoadingForm(true)
      console.log('Loading form schema from database:', formSchemaId)
      
      const formData = await fetchFormSchemaById(formSchemaId)
      
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
        setSavedDbFormId(formSchemaId)
      } else {
        console.error('Failed to load form schema')
      }
    } catch (error) {
      console.error('Error loading form schema:', error)
    } finally {
      setIsLoadingForm(false)
    }
  }, [fetchFormSchemaById, setValue])

  // Load existing contest data
  useEffect(() => {
    const loadContestData = async () => {
      try {
        setIsLoading(true)
        console.log('Loading contest data for:', contestId)
        
        // Fetch contest data from Supabase
        const { data: contestData, error } = await supabase
          .from('contests')
          .select('*')
          .eq('id', contestId)
          .single()
        
        if (error) {
          console.error('Error loading contest:', error)
          alert('Failed to load contest data')
          setIsLoading(false)
          return
        }
        
        if (contestData) {
          console.log('Contest data loaded:', contestData)
          
          // Pre-fill basic details from contest data
          setValue('basicDetails.name', contestData.name || '')
          setValue('basicDetails.contestType', contestData.contest_type || '')
          setValue('basicDetails.startDate', contestData.start_date || '')
          setValue('basicDetails.endDate', contestData.end_date || '')
          
          // TODO: Load other sections when available
          // setValue('actions.rewardType', contestData.reward_type || '')
          // setValue('postCapture.behaviour', contestData.post_capture_behaviour || '')
          // setValue('targeting.audienceSegment', contestData.audience_segment || '')
          
          // If contest has a form schema, load it
          if (contestData.form_schema_id) {
            console.log('Contest has form schema, loading:', contestData.form_schema_id)
            setSavedDbFormId(contestData.form_schema_id)
            await loadFormSchemaFromDb(contestData.form_schema_id)
          } else {
            console.log('Contest has no form schema yet - will create on first save')
          }
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading contest:', error)
        setIsLoading(false)
      }
    }

    loadContestData()
  }, [contestId, setValue, loadFormSchemaFromDb])

  // Save or update form schema to database
  const saveFormSchema = async () => {
    try {
      const formBuilderData = getValues('formBuilder')
      const { formTitle, formDescription, fields, containers, design } = formBuilderData
      
      const schema = {
        title: formTitle,
        description: formDescription,
        fields,
        containers,
        design,
      }

      let dbFormId: string

      // Check if we're updating an existing form schema
      if (savedDbFormId) {
        // UPDATE existing form schema
        console.log('Updating existing form schema:', savedDbFormId)
        
        const { data, error } = await supabase
          .from('form_schemas')
          .update({
            title: formTitle,
            description: formDescription,
            schema: schema,
            updated_at: new Date().toISOString(),
          })
          .eq('id', savedDbFormId)
          .select()
          .single()

        if (error) {
          console.error('Error updating form:', error)
          alert(`Error updating form: ${error.message}`)
          return null
        }

        dbFormId = data.id
        console.log('Form updated successfully:', data)
      } else {
        // CREATE new form schema (contest exists but no form schema yet)
        console.log('Creating new form schema for existing contest:', contestId)
        
        const embedId = generateFormId()
        
        const { data, error } = await supabase
          .from('form_schemas')
          .insert([{
            title: formTitle,
            description: formDescription,
            schema: schema,
            form_id: embedId,
            contest_id: contestId,
          }])
          .select()
          .single()

        if (error) {
          console.error('Error creating form:', error)
          alert(`Error creating form: ${error.message}`)
          return null
        }

        dbFormId = data.id
        console.log('Form created successfully:', data)

        // Update contest record with form_schema_id
        const { error: contestError } = await supabase
          .from('contests')
          .update({ form_schema_id: dbFormId })
          .eq('id', contestId)

        if (contestError) {
          console.error('Error linking form to contest:', contestError)
        } else {
          console.log('Contest linked to form schema successfully')
        }
      }

      setSavedDbFormId(dbFormId)
      setValue('formBuilder.formId', dbFormId)
      
      return dbFormId
    } catch (error) {
      console.error('Error saving form:', error)
      alert('Error saving form to database. Please try again.')
      return null
    }
  }

  // Update contest basic details
  const updateContestBasicDetails = async () => {
    try {
      const basicDetails = getValues('basicDetails')
      
      const { error } = await supabase
        .from('contests')
        .update({
          name: basicDetails.name,
          contest_type: basicDetails.contestType,
          start_date: basicDetails.startDate,
          end_date: basicDetails.endDate,
          updated_at: new Date().toISOString(),
        })
        .eq('id', contestId)

      if (error) {
        console.error('Error updating contest:', error)
        alert(`Error updating contest: ${error.message}`)
        return false
      }

      console.log('Contest basic details updated successfully')
      return true
    } catch (error) {
      console.error('Error updating contest:', error)
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
          const updated = await updateContestBasicDetails()
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

      case 2: // Actions
        isValid = await form.trigger('actions')
        if (isValid) {
          console.log('Actions validated:', getValues('actions'))
          setCurrentStep(3)
        }
        break

      case 3: // Post Capture
        isValid = await form.trigger('postCapture')
        if (isValid) {
          console.log('Post Capture validated:', getValues('postCapture'))
          setCurrentStep(4)
        }
        break

      case 4: // Targeting - Final step
        isValid = await form.trigger('targeting')
        if (isValid) {
          console.log('Targeting validated:', getValues('targeting'))
          await handleFinalSubmit()
        }
        break
    }
  }

  // Final submission - update contest
  const handleFinalSubmit = async () => {
    const allData = getValues()
    console.log('Contest update completed!')
    console.log('All updated form data:', allData)

    // TODO: Submit to backend
    // 1. Update form schema separately
    // await updateFormSchema(contestId, allData.formBuilder)
    
    // 2. Update other contest data
    // await updateContestData(contestId, {
    //   basicDetails: allData.basicDetails,
    //   actions: allData.actions,
    //   postCapture: allData.postCapture,
    //   targeting: allData.targeting
    // })

    // Redirect back to contest view page after successful update
    router.push(`/contests/${contestId}`)
  }

  const handlePrevious = () => {
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
              <span className="text-sm text-[#637083] font-medium truncate">
                ({contestId})
              </span>
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
                {currentStep === 4 ? 'Save Changes' : 'Next Step'}
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
            
            {/* Step 5: Targeting */}
            {currentStep === 4 && (
              <div ref={formRef} className="h-full">
                <Suspense fallback={<FormLoading />}>
                  <TargetingForm
                    control={form.control}
                    fieldPrefix="targeting"
                  />
                </Suspense>
              </div>
            )}
          </div>
          
          {/* Preview Section - Hidden on form builder step (step 1) */}
          {currentStep !== 1 && (
            <div className="lg:flex-[0.45] min-h-0">
              <ContestPreview formData={formBuilderData} currentStep={currentStep} />
            </div>
          )}
        </div>
      </div>
    </FormProvider>
  )
}
