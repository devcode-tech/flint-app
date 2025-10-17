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

  /**
   * Create a new form schema
   */
  const createFormSchema = useCallback(async (formData: {
    form_id: string
    contest_id?: string
    title: string
    description: string
    fields: FormFieldData[]
    containers: LayoutContainer[]
    design: FormDesign
  }) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: createError } = await supabase
        .from('form_schemas')
        .insert([{
          form_id: formData.form_id,
          contest_id: formData.contest_id,
          title: formData.title,
          description: formData.description,
          schema: {
            title: formData.title,
            description: formData.description,
            fields: formData.fields,
            containers: formData.containers,
            design: formData.design
          }
        }])
        .select()
        .single()

      if (createError) {
        console.error('Error creating form schema:', createError)
        setError(createError.message)
        throw createError
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Error creating form schema:', err)
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Update an existing form schema
   */
  const updateFormSchema = useCallback(async (id: string, formData: {
    title: string
    description: string
    fields: FormFieldData[]
    containers: LayoutContainer[]
    design: FormDesign
  }) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: updateError } = await supabase
        .from('form_schemas')
        .update({
          title: formData.title,
          description: formData.description,
          schema: {
            title: formData.title,
            description: formData.description,
            fields: formData.fields,
            containers: formData.containers,
            design: formData.design
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating form schema:', updateError)
        setError(updateError.message)
        throw updateError
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Error updating form schema:', err)
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    fetchFormSchemaById,
    fetchFormSchemaByEmbedId,
    createFormSchema,
    updateFormSchema
  }
}
