import React from 'react'
import { Card } from '@/components/atoms/Card'

interface ChartSkeletonProps {
  height?: number
  showHeader?: boolean
}

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({ 
  height = 247,
  showHeader = true 
}) => {
  return (
    <Card className="p-0 animate-pulse">
      {showHeader && (
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-gray-200 rounded w-32" />
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded w-16" />
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-4 mb-6">
        <div className="h-9 bg-gray-200 rounded w-20" />
        <div className="flex flex-col gap-1">
          <div className="h-4 bg-gray-200 rounded w-12" />
          <div className="h-3 bg-gray-200 rounded w-20" />
        </div>
      </div>
      
      <div 
        className="bg-gray-100 rounded-lg flex items-end justify-center gap-1 p-4"
        style={{ height }}
      >
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-t"
            style={{
              height: `${Math.random() * 80 + 20}%`,
              width: '8px'
            }}
          />
        ))}
      </div>
    </Card>
  )
}
