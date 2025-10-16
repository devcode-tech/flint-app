import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { FormFieldData, FormDesign, LayoutContainer } from '@devcode-tech/form-builder'

export interface FormSchemaData {
  id: string
  form_id: string
  title: string
  description: string
  schema: {
    title: string
    description: string
    fields: FormFieldData[]
    containers: LayoutContainer[]
    design: FormDesign
  }
  created_at?: string
  updated_at?: string
}

export interface FormBuilderData {
  formId?: string
  formTitle: string
  formDescription: string
  fields: FormFieldData[]
  containers: LayoutContainer[]
  design: FormDesign
}

/**
 * Hook for fetching and managing form schemas from Supabase
 */
export function useFormSchema() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch form schema by database ID (UUID)
   */
  const fetchFormSchemaById = useCallback(async (id: string): Promise<FormBuilderData | null> => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('form_schemas')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) {
        console.error('Error fetching form schema by ID:', fetchError)
        setError(fetchError.message)
        return null
      }

      if (!data) {
        setError('Form schema not found')
        return null
      }

      // Transform database schema to FormBuilderData format
      const formBuilderData: FormBuilderData = {
        formId: data.id,
        formTitle: data.schema.title || data.title,
        formDescription: data.schema.description || data.description,
        fields: data.schema.fields || [],
        containers: data.schema.containers || [],
        design: data.schema.design || {}
      }

      return formBuilderData
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Error fetching form schema:', err)
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Fetch form schema by embed ID (form_id)
   */
  const fetchFormSchemaByEmbedId = useCallback(async (embedId: string): Promise<FormBuilderData | null> => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('form_schemas')
        .select('*')
        .eq('form_id', embedId)
        .single()

      if (fetchError) {
        console.error('Error fetching form schema by embed ID:', fetchError)
        setError(fetchError.message)
        return null
      }

      if (!data) {
        setError('Form schema not found')
        return null
      }

      // Transform database schema to FormBuilderData format
      const formBuilderData: FormBuilderData = {
        formId: data.id,
        formTitle: data.schema.title || data.title,
        formDescription: data.schema.description || data.description,
        fields: data.schema.fields || [],
        containers: data.schema.containers || [],
        design: data.schema.design || {}
      }

      return formBuilderData
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Error fetching form schema:', err)
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    fetchFormSchemaById,
    fetchFormSchemaByEmbedId
  }
}
