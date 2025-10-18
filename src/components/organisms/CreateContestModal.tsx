'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useContestApi } from '@/hooks/useContestApi'

// Validation schema for modal form
const createContestModalSchema = z.object({
  name: z.string().min(1, 'Contest name is required'),
  contestType: z.string().min(1, 'Contest type is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
}).refine((data) => {
  const start = new Date(data.startDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset time to start of day
  return start >= today
}, {
  message: 'Start date cannot be in the past',
  path: ['startDate'],
}).refine((data) => {
  const start = new Date(data.startDate)
  const end = new Date(data.endDate)
  return end > start
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
})

type CreateContestModalData = z.infer<typeof createContestModalSchema>

interface CreateContestModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CreateContestModal: React.FC<CreateContestModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createContest } = useContestApi()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateContestModalData>({
    resolver: zodResolver(createContestModalSchema),
  })

  const onSubmit = async (data: CreateContestModalData) => {
    try {
      setIsSubmitting(true)

      // Create contest using API
      const contestData = await createContest({
        name: data.name,
        contest_type: data.contestType,
        start_date: data.startDate,
        end_date: data.endDate,
      })

      console.log('Contest created successfully:', contestData)

      // Close modal and reset form
      reset()
      onClose()

      // Redirect to create contest page with contest ID
      router.push(`/contests/${contestData.id}/create`)
    } catch (error) {
      console.error('Error creating contest:', error)
      alert(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      reset()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Create Contest</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-5">
          {/* Contest Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name of the Contest
            </label>
            <input
              id="name"
              type="text"
              placeholder="Conversion PRO"
              {...register('name')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Contest Type */}
          <div>
            <label htmlFor="contestType" className="block text-sm font-medium text-gray-700 mb-2">
              Contest Type
            </label>
            <select
              id="contestType"
              {...register('contestType')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
            >
              <option value="">Select contest type</option>
              <option value="conversion">Conversion Mode</option>
              <option value="engagement" disabled>Engagement Mode (Coming Soon)</option>
              <option value="referral" disabled>Loyalty Mode (Coming Soon)</option>
            </select>
            {errors.contestType && (
              <p className="mt-1 text-sm text-red-600">{errors.contestType.message}</p>
            )}
          </div>

          {/* Contest Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Contest Start Date
            </label>
            <input
              id="startDate"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              {...register('startDate')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
            )}
          </div>

          {/* Contest End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              Contest End Date
            </label>
            <input
              id="endDate"
              type="date"
              {...register('endDate')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#005EB8] text-white font-medium rounded-lg hover:bg-[#004A94] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Create Contest
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
