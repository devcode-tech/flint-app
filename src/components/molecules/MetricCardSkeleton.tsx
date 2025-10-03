import React from 'react'
import { Card } from '@/components/atoms/Card'

export const MetricCardSkeleton: React.FC = () => {
  return (
    <Card className="flex items-center gap-6 p-5 animate-pulse">
      <div className="flex flex-col justify-center items-start gap-3 flex-1">
        {/* Icon skeleton */}
        <div className="w-10 h-10 bg-gray-200 rounded-xl" />
        
        {/* Content skeleton */}
        <div className="flex justify-between items-end self-stretch">
          <div className="flex flex-col items-start gap-1">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-8 bg-gray-200 rounded w-16" />
          </div>
          
          {/* Indicator skeleton */}
          <div className="flex items-center gap-0.5">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-8" />
          </div>
        </div>
      </div>
    </Card>
  )
}
