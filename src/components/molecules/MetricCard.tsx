import React from 'react'
import { ArrowUp, ShoppingCart, DollarSign, Users, UserCheck } from 'lucide-react'
import { Card } from '@/components/atoms/Card'
import { cn } from '@/lib/utils'
import type { MetricData } from '@/types/dashboard'

interface MetricCardProps {
  data: MetricData
}

const iconMap = {
  cart: ShoppingCart,
  money: DollarSign,
  users: Users,
  userCheck: UserCheck,
}

export const MetricCard: React.FC<MetricCardProps> = ({ data }) => {
  const IconComponent = iconMap[data.icon as keyof typeof iconMap] || ShoppingCart

  return (
    <Card className="flex items-center gap-6 p-5">
      <div className="flex flex-col justify-center items-start gap-3 flex-1">
        {/* Featured Icon */}
        <div className="flex w-10 h-10 p-2.5 justify-center items-center rounded-xl bg-gradient-to-b from-[#F9FAFB] to-[#F2F4F7] shadow-[0_0_0_2px_#FFF,0_0_0_3px_#F2F4F7]">
          <IconComponent className="w-5 h-5 text-[#141C25]" />
        </div>
        
        {/* Content */}
        <div className="flex justify-between items-end self-stretch">
          <div className="flex flex-col items-start gap-1">
            <div className="text-[#637083] text-sm font-normal leading-5 capitalize">
              {data.title}
            </div>
            <div className="text-[#141C25] text-2xl font-medium leading-8 tracking-[-0.24px]">
              {data.value}
            </div>
          </div>
          
          {/* Indicator */}
          <div className="flex items-center gap-0.5">
            <ArrowUp className="w-4 h-4 text-[#10B978]" />
            <div className="text-[#10B978] text-sm font-medium leading-5 capitalize">
              {data.change}%
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
