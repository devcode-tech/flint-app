'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import FormDropdown from '@/components/atoms/FormDropdown'

const actionsSchema = z.object({
  rewardType: z.string().min(1, 'Reward type is required'),
  chooseReward: z.string().min(1, 'Choose reward is required'),
})

type ActionsFormData = z.infer<typeof actionsSchema>

interface ActionsFormProps {
  onSubmit: (data: ActionsFormData) => void
  className?: string
}

const ActionsForm: React.FC<ActionsFormProps> = ({ onSubmit, className }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    clearErrors,
  } = useForm<ActionsFormData>({
    resolver: zodResolver(actionsSchema),
    mode: 'onChange',
    defaultValues: {
      rewardType: '',
      chooseReward: '',
    },
  })

  const watchedValues = watch()

  const handleFormSubmit = (data: ActionsFormData) => {
    onSubmit(data)
  }

  const rewardTypeOptions = [
    { value: 'single-coupon', label: 'Single Coupon' },
    { value: 'multiple-coupons', label: 'Multiple Coupons' },
    { value: 'discount-percentage', label: 'Discount Percentage' },
    { value: 'fixed-amount', label: 'Fixed Amount' },
  ]

  const chooseRewardOptions = [
    { value: 'dynamic-coupons', label: 'Dynamic Coupons' },
    { value: 'static-coupons', label: 'Static Coupons' },
    { value: 'gift-cards', label: 'Gift Cards' },
    { value: 'loyalty-points', label: 'Loyalty Points' },
  ]

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-[#141C25] font-inter text-lg font-semibold leading-7">
          Actions
        </h2>
        <p className="text-[#637083] font-inter text-sm font-normal leading-5">
          Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col flex-1" noValidate>
        <div className="flex flex-col gap-6 flex-1">
          {/* Reward Type */}
          <div className="flex flex-col gap-2">
            <FormDropdown
              name="rewardType"
              control={control}
              label="Reward Type"
              placeholder="Single Coupon"
              options={rewardTypeOptions}
              error={errors.rewardType?.message}
              onFocus={() => clearErrors('rewardType')}
              required
            />
          </div>

          {/* Choose Reward */}
          <div className="flex flex-col gap-2">
            <FormDropdown
              name="chooseReward"
              control={control}
              label="Choose Reward"
              placeholder="Dynamic Coupons"
              options={chooseRewardOptions}
              error={errors.chooseReward?.message}
              onFocus={() => clearErrors('chooseReward')}
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

export default ActionsForm
