import { z } from 'zod'

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

// Form Field Schema
export const formFieldSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'email', 'phone', 'select', 'textarea']),
  label: z
    .string()
    .min(1, 'Field label is required')
    .max(50, 'Field label must be less than 50 characters'),
  placeholder: z
    .string()
    .max(100, 'Placeholder must be less than 100 characters'),
  required: z.boolean(),
  options: z.array(z.string()).optional()
})

// Create Form Schema
export const createFormSchema = z.object({
  formFields: z
    .array(formFieldSchema)
    .min(1, 'At least one form field is required')
    .max(20, 'Maximum 20 form fields allowed')
})

// Actions Schema
export const actionsSchema = z.object({
  redirectUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  
  emailNotifications: z.boolean(),
  
  autoResponder: z.object({
    enabled: z.boolean(),
    subject: z.string().optional(),
    message: z.string().optional()
  }).optional(),
  
  integrations: z.array(z.object({
    type: z.enum(['webhook', 'email', 'zapier']),
    url: z.string().url('Please enter a valid URL'),
    enabled: z.boolean()
  })).optional()
})

// Post Capture Schema
export const postCaptureSchema = z.object({
  thankYouMessage: z
    .string()
    .min(1, 'Thank you message is required')
    .max(500, 'Message must be less than 500 characters'),
  
  showSocialShare: z.boolean(),
  
  collectAdditionalData: z.boolean(),
  
  customCss: z.string().optional()
})

// Targeting Schema
export const targetingSchema = z.object({
  countries: z.array(z.string()).optional(),
  
  ageRange: z.object({
    min: z.number().min(13, 'Minimum age is 13').max(100),
    max: z.number().min(13).max(100, 'Maximum age is 100')
  }).optional(),
  
  interests: z.array(z.string()).optional(),
  
  deviceTypes: z.array(z.enum(['desktop', 'mobile', 'tablet'])).optional(),
  
  schedule: z.object({
    enabled: z.boolean(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    timezone: z.string().optional()
  }).optional()
})

// Complete Contest Schema
export const completeContestSchema = z.object({
  basicDetails: basicDetailsSchema,
  createForm: createFormSchema,
  actions: actionsSchema,
  postCapture: postCaptureSchema,
  targeting: targetingSchema
})

// Type exports
export type BasicDetailsFormData = z.infer<typeof basicDetailsSchema>
export type FormFieldData = z.infer<typeof formFieldSchema>
export type CreateFormData = z.infer<typeof createFormSchema>
export type ActionsData = z.infer<typeof actionsSchema>
export type PostCaptureData = z.infer<typeof postCaptureSchema>
export type TargetingData = z.infer<typeof targetingSchema>
export type CompleteContestData = z.infer<typeof completeContestSchema>

// Contest type options
export const contestTypeOptions: Array<{ value: string; label: string }> = [
  { value: 'engagement', label: 'Engagement Mode' },
  { value: 'loyalty', label: 'Loyalty Mode' },
  { value: 'conversion', label: 'Conversion Mode' }
]
