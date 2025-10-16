'use client'

import React, { useCallback } from 'react'
import { FormBuilder } from '@devcode-tech/form-builder'
import type { FormFieldData, FormDesign, LayoutContainer } from '@devcode-tech/form-builder'
import type { FormBuilderData } from '@/schemas/contestSchema'

interface ContestFormBuilderProps {
  onSubmit?: (formData: FormBuilderData) => void
  defaultValues?: FormBuilderData
  onDataChange?: (formData: FormBuilderData) => void
  isEditMode?: boolean
  contestId?: string
}

// Export for backward compatibility
export type ContestFormData = FormBuilderData

export const ContestFormBuilder: React.FC<ContestFormBuilderProps> = ({
  onSubmit,
  defaultValues,
  onDataChange,
  isEditMode = false,
  contestId
}) => {
  // Handle form save - called by FormBuilder when user saves
  const handleSave = useCallback(async (formData: any): Promise<string | null> => {
    try {
      // Structure the data for contest form
      const contestFormData: FormBuilderData = {
        formId: defaultValues?.formId || contestId || `form_${Date.now()}`,
        formTitle: formData.title || 'Contest Entry Form',
        formDescription: formData.description || '',
        fields: formData.fields || [],
        containers: formData.containers || [],
        design: formData.design || {}
      }

      // Auto-save to parent component state
      if (onDataChange) {
        onDataChange(contestFormData)
        console.log('✅ Form data auto-saved to parent state:', contestFormData)
      } else {
        console.log('⚠️ onDataChange callback not provided')
      }

      // TODO: Save to your backend/database (Supabase)
      if (isEditMode) {
        console.log('💾 Updating contest form to backend:', contestFormData)
      } else {
        console.log('💾 Saving contest form to backend:', contestFormData)
      }
      
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
  }, [onSubmit, defaultValues, onDataChange, isEditMode, contestId])

  // Handle form update - called when editing existing form
  const handleUpdate = useCallback(async (formId: string, formData: any): Promise<boolean> => {
    try {
      const contestFormData: FormBuilderData = {
        formId,
        formTitle: formData.title || 'Contest Entry Form',
        formDescription: formData.description || '',
        fields: formData.fields || [],
        containers: formData.containers || [],
        design: formData.design || {}
      }

      // Auto-save to parent component state
      if (onDataChange) {
        onDataChange(contestFormData)
      }

      // TODO: Update in your backend/database (Supabase)
      console.log('Updating contest form:', contestFormData)
      
      await new Promise(resolve => setTimeout(resolve, 500))

      return true
    } catch (error) {
      console.error('Error updating form:', error)
      return false
    }
  }, [onDataChange])

  // Handle form load - called when loading existing form
  const handleLoad = useCallback(async (formId: string): Promise<any> => {
    try {
      // TODO: Load from your backend/database (Supabase)
      console.log('Loading contest form:', formId)
      
      // For now, return default values if available
      if (defaultValues && defaultValues.formId === formId) {
        return {
          title: defaultValues.formTitle,
          description: defaultValues.formDescription,
          fields: defaultValues.fields,
          containers: defaultValues.containers,
          design: defaultValues.design
        }
      }
      
      return null
    } catch (error) {
      console.error('Error loading form:', error)
      return null
    }
  }, [defaultValues])

  return (
    <div className="h-full w-full">
      <FormBuilder 
        initialFormId={isEditMode ? (contestId || defaultValues?.formId) : defaultValues?.formId}
        onSave={handleSave}
        onUpdate={handleUpdate}
        onLoad={handleLoad}
      />
    </div>
  )
}
