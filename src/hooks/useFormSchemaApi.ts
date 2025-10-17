import { useState, useCallback } from 'react'
import type { FormFieldData, FormDesign, LayoutContainer } from '@devcode-tech/form-builder'

export interface FormSchemaData {
  id: string
  form_id: string
  contest_id?: string
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

export interface CreateFormSchemaData {
  title: string
  description?: string
  schema: {
    title: string
    description: string
    fields: FormFieldData[]
    containers: LayoutContainer[]
    design: FormDesign
  }
  contest_id?: string
}

export interface UpdateFormSchemaData {
  title: string
  description?: string
  schema: {
    title: string
    description: string
    fields: FormFieldData[]
    containers: LayoutContainer[]
    design: FormDesign
  }
}

/**
 * Reusable hook for Form Schema API operations
 */
export function useFormSchemaApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch form schemas with optional filters
   */
  const fetchFormSchemas = useCallback(async (filters?: { contest_id?: string; form_id?: string }) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filters?.contest_id) params.append('contest_id', filters.contest_id)
      if (filters?.form_id) params.append('form_id', filters.form_id)

      const response = await fetch(`/api/form-schemas?${params.toString()}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch form schemas')
      }

      return result.data as FormSchemaData[]
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Fetch a single form schema by ID
   */
  const fetchFormSchema = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/form-schemas/${id}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch form schema')
      }

      return result.data as FormSchemaData
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Create a new form schema
   */
  const createFormSchema = useCallback(async (data: CreateFormSchemaData) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/form-schemas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create form schema')
      }

      return result.data as FormSchemaData
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Update a form schema
   */
  const updateFormSchema = useCallback(async (id: string, data: UpdateFormSchemaData) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/form-schemas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update form schema')
      }

      return result.data as FormSchemaData
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Delete a form schema
   */
  const deleteFormSchema = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/form-schemas/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete form schema')
      }

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    fetchFormSchemas,
    fetchFormSchema,
    createFormSchema,
    updateFormSchema,
    deleteFormSchema,
  }
}
