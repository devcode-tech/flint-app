import { z } from 'zod'
import type { FormFieldData as FormBuilderFieldData, FormDesign, LayoutContainer } from '@devcode-tech/form-builder'

// Basic Details Schema
export const basicDetailsSchema = z.object({
  name: z
    .string()
    .min(1, 'Contest name is required')
    .min(3, 'Contest name must be at least 3 characters')
    .max(100, 'Contest name must be less than 100 characters'),
  
  contestType: z
    .string()
    .min(1, 'Contest type is required'),
  
  startDate: z
    .string()
    .min(1, 'Start date is required')
    .refine((date) => {
      const selectedDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selectedDate >= today
    }, 'Start date cannot be in the past'),
  
  endDate: z
    .string()
    .min(1, 'End date is required')
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.endDate) > new Date(data.startDate)
  }
  return true
}, {
  message: 'End date must be after start date',
  path: ['endDate']
})

// Form Builder Schema - matches the actual ContestFormBuilder implementation
export const formBuilderSchema = z.object({
  formId: z.string().optional(),
  formTitle: z.string().default('Contest Entry Form'),
  formDescription: z.string().default(''),
  fields: z.array(z.any()).default([]), // FormFieldData from form-builder
  containers: z.array(z.any()).default([]), // LayoutContainer from form-builder
  design: z.any().default({}) // FormDesign from form-builder
})

// Actions Schema - matches the actual ActionsForm implementation
export const actionsSchema = z.object({
  rewardType: z.string().min(1, 'Reward type is required'),
  chooseReward: z.string().min(1, 'Choose reward is required')
})

// Post Capture Schema - matches the actual PostCaptureForm implementation
export const postCaptureSchema = z.object({
  behaviour: z.string().min(1, 'Behaviour is required'),
  autoclose: z.string().min(1, 'Autoclose is required'),
  title: z.string().min(1, 'Post capture content is required'),
  description: z.string().optional(), // No longer used - kept for compatibility
  url: z.string().optional() // No longer used - kept for compatibility
})

// Post Contest Schema - content shown after contest ends (optional)
export const postContestSchema = z.object({
  content: z.string().optional()
})

// Targeting Schema - matches the actual TargetingForm implementation
export const targetingSchema = z.object({
  audienceSegment: z.string().min(1, 'Audience segment is required')
})

// Complete Contest Schema - all steps combined
export const completeContestSchema = z.object({
  basicDetails: basicDetailsSchema,
  formBuilder: formBuilderSchema,
  actions: actionsSchema,
  postCapture: postCaptureSchema,
  postContest: postContestSchema,
  targeting: targetingSchema
})

// Type exports
export type BasicDetailsFormData = z.infer<typeof basicDetailsSchema>
export type FormBuilderData = z.infer<typeof formBuilderSchema>
export type ActionsData = z.infer<typeof actionsSchema>
export type PostCaptureData = z.infer<typeof postCaptureSchema>
export type PostContestData = z.infer<typeof postContestSchema>
export type TargetingData = z.infer<typeof targetingSchema>
export type CompleteContestData = z.infer<typeof completeContestSchema>

// Legacy type exports for backward compatibility
export type FormFieldData = FormBuilderFieldData
export type CreateFormData = z.infer<typeof formBuilderSchema>

// Contest type options
export const contestTypeOptions: Array<{ value: string; label: string; disabled?: boolean }> = [
  { value: 'conversion', label: 'Conversion Mode' },
  { value: 'engagement', label: 'Engagement Mode (Coming Soon)', disabled: true },
  { value: 'loyalty', label: 'Loyalty Mode (Coming Soon)', disabled: true },
  { value: 'sweepstakes', label: 'Sweepstakes' }
]
