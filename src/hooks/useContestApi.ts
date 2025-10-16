import { useState, useCallback } from 'react'

export interface Contest {
  id: string
  name: string
  contest_type: string
  start_date: string
  end_date: string
  form_schema_id?: string
  status?: string
  created_at?: string
  updated_at?: string
}

export interface CreateContestData {
  name: string
  contest_type: string
  start_date: string
  end_date: string
}

export interface UpdateContestData {
  name?: string
  contest_type?: string
  start_date?: string
  end_date?: string
  form_schema_id?: string
  status?: string
}

/**
 * Reusable hook for Contest API operations
 */
export function useContestApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch all contests
   */
  const fetchContests = useCallback(async (filters?: { status?: string; search?: string }) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filters?.status) params.append('status', filters.status)
      if (filters?.search) params.append('search', filters.search)

      const response = await fetch(`/api/contests?${params.toString()}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch contests')
      }

      return result.data as Contest[]
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Fetch a single contest by ID
   */
  const fetchContest = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/contests/${id}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch contest')
      }

      return result.data as Contest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Create a new contest
   */
  const createContest = useCallback(async (data: CreateContestData) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/contests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create contest')
      }

      return result.data as Contest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Update a contest
   */
  const updateContest = useCallback(async (id: string, data: UpdateContestData) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/contests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update contest')
      }

      return result.data as Contest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Delete a contest
   */
  const deleteContest = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/contests/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete contest')
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
    fetchContests,
    fetchContest,
    createContest,
    updateContest,
    deleteContest,
  }
}
