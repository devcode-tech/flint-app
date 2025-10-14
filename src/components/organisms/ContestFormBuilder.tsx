'use client'

import React, { useCallback } from 'react'
import { FormBuilder } from '@devcode-tech/form-builder'
import type { FormFieldData, FormDesign, LayoutContainer } from '@devcode-tech/form-builder'

interface ContestFormBuilderProps {
  onSubmit?: (formData: ContestFormData) => void
  defaultValues?: ContestFormData
}

export interface ContestFormData {
  formId?: string
  formTitle: string
  formDescription: string
  fields: FormFieldData[]
  containers: LayoutContainer[]
  design: FormDesign
}

export const ContestFormBuilder: React.FC<ContestFormBuilderProps> = ({
  onSubmit,
  defaultValues
}) => {
  // Handle form save
  const handleSave = useCallback(async (formData: any): Promise<string | null> => {
    try {
      // Structure the data for contest form
      const contestFormData: ContestFormData = {
        formId: defaultValues?.formId || `form_${Date.now()}`,
        formTitle: formData.title || 'Contest Entry Form',
        formDescription: formData.description || '',
        fields: formData.fields || [],
        containers: formData.containers || [],
        design: formData.design || {}
      }

      // TODO: Save to your backend/database
      console.log('Saving contest form:', contestFormData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // Call parent's onSubmit if provided
      if (onSubmit) {
        onSubmit(contestFormData)
      }

      return contestFormData.formId || null
    } catch (error) {
      console.error('Error saving form:', error)
      return null
    }
  }, [onSubmit, defaultValues])

  return (
    <FormBuilder />
  )
}
