'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import FormDropdown from '@/components/atoms/FormDropdown'
import FormInput from '@/components/atoms/FormInput'

const postCaptureSchema = z.object({
  behaviour: z.string().min(1, 'Behaviour is required'),
  autoclose: z.string().min(1, 'Autoclose is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  url: z.string().url('Please enter a valid URL').min(1, 'URL is required'),
})

type PostCaptureFormData = z.infer<typeof postCaptureSchema>

interface PostCaptureFormProps {
  onSubmit: (data: PostCaptureFormData) => void
  className?: string
}

const PostCaptureForm: React.FC<PostCaptureFormProps> = ({ onSubmit, className }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    clearErrors,
  } = useForm<PostCaptureFormData>({
    resolver: zodResolver(postCaptureSchema),
    mode: 'onChange',
    defaultValues: {
      behaviour: '',
      autoclose: '',
      title: '',
      description: '',
      url: '',
    },
  })

  const watchedValues = watch()

  const handleFormSubmit = (data: PostCaptureFormData) => {
    onSubmit(data)
  }

  const behaviourOptions = [
    { value: 'thank-you', label: 'Thank You' },
    { value: 'redirect', label: 'Redirect' },
    { value: 'popup', label: 'Popup' },
    { value: 'modal', label: 'Modal' },
  ]

  const autocloseOptions = [
    { value: 'after-5-seconds', label: 'After 5 seconds' },
    { value: 'after-10-seconds', label: 'After 10 seconds' },
    { value: 'after-15-seconds', label: 'After 15 seconds' },
    { value: 'manual', label: 'Manual' },
  ]

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-[#141C25] font-inter text-lg font-semibold leading-7">
          Post Capture
        </h2>
        <p className="text-[#637083] font-inter text-sm font-normal leading-5">
          Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col flex-1" noValidate>
        <div className="flex flex-col gap-6 flex-1">
          {/* Behaviour */}
          <div className="flex flex-col gap-2">
            <FormDropdown
              name="behaviour"
              control={control}
              label="Behaviour"
              placeholder="Thank You"
              options={behaviourOptions}
              error={errors.behaviour?.message}
              onFocus={() => clearErrors('behaviour')}
              required
            />
          </div>

          {/* Autoclose */}
          <div className="flex flex-col gap-2">
            <FormDropdown
              name="autoclose"
              control={control}
              label="Autoclose"
              placeholder="After 5 seconds"
              options={autocloseOptions}
              error={errors.autoclose?.message}
              onFocus={() => clearErrors('autoclose')}
              required
            />
          </div>

          {/* Title */}
          <div className="flex flex-col gap-2">
            <FormInput
              name="title"
              control={control}
              label="Title"
              placeholder="Thank You Title"
              error={errors.title?.message}
              onFocus={() => clearErrors('title')}
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <FormInput
              name="description"
              control={control}
              label="Description"
              placeholder="Description"
              error={errors.description?.message}
              onFocus={() => clearErrors('description')}
              required
              multiline
              rows={4}
            />
          </div>

          {/* URL */}
          <div className="flex flex-col gap-2">
            <FormInput
              name="url"
              control={control}
              label="URL"
              placeholder="https://"
              error={errors.url?.message}
              onFocus={() => clearErrors('url')}
              required
            />
          </div>
        </div>

        {/* Submit Button - Hidden as navigation is handled by parent */}
        <button type="submit" className="hidden">
          Submit
        </button>
      </form>
    </div>
  )
}

export default PostCaptureForm
