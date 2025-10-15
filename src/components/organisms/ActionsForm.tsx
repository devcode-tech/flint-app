'use client'

import React from 'react'
import { Control, useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'
import FormDropdown from '@/components/atoms/FormDropdown'
import type { CompleteContestData } from '@/schemas/contestSchema'

interface ActionsFormProps {
  control: Control<CompleteContestData>
  fieldPrefix: 'actions'
  className?: string
}

const ActionsForm: React.FC<ActionsFormProps> = ({ control, fieldPrefix, className }) => {
  const { formState: { errors } } = useFormContext<CompleteContestData>() || { formState: { errors: {} } }

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
          Configure rewards and actions for your contest
        </p>
      </div>

      {/* Form */}
      <div className="flex flex-col flex-1">
        <div className="flex flex-col gap-6 flex-1">
          {/* Reward Type */}
          <div className="flex flex-col gap-2">
            <FormDropdown
              name={`${fieldPrefix}.rewardType`}
              control={control}
              label="Reward Type"
              placeholder="Single Coupon"
              options={rewardTypeOptions}
              error={errors.actions?.rewardType?.message}
              required
            />
          </div>

          {/* Choose Reward */}
          <div className="flex flex-col gap-2">
            <FormDropdown
              name={`${fieldPrefix}.chooseReward`}
              control={control}
              label="Choose Reward"
              placeholder="Dynamic Coupons"
              options={chooseRewardOptions}
              error={errors.actions?.chooseReward?.message}
              required
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActionsForm
