import React from 'react'
import { ArrowUpCircle } from 'lucide-react'
import { Button } from '@/components/atoms/Button'

interface ChartHeaderProps {
  title: string
  value: string | number
  change: number
  changeLabel?: string
  timeRangeButtons?: string[]
  selectedTimeRange?: string
  onTimeRangeChange?: (range: string) => void
}

export const ChartHeader: React.FC<ChartHeaderProps> = ({
  title,
  value,
  change,
  changeLabel = 'vs. Last period',
  timeRangeButtons = ['24 Hours', '7 Days', '1 Month', '6 Months', '1 Year'],
  selectedTimeRange = '1 Month',
  onTimeRangeChange
}) => {
  return (
    <div className="space-y-4">
      {/* Header with title and time range buttons */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h3 className="text-[#141C25] text-base font-medium leading-6">
          {title}
        </h3>
        
        {/* Time Range Button Group */}
        <div className="flex rounded-lg border border-[#E4E7EC] shadow-sm overflow-hidden">
          {timeRangeButtons.map((range, index) => (
            <Button
              key={range}
              variant={selectedTimeRange === range ? 'secondary' : 'ghost'}
              size="sm"
              className={`
                rounded-none border-0 text-sm font-medium
                ${index !== 0 ? 'border-l border-[#E4E7EC]' : ''}
                ${selectedTimeRange === range ? 'bg-[#F2F4F7]' : 'bg-white hover:bg-gray-50'}
              `}
              onClick={() => onTimeRangeChange?.(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Value and change indicator */}
      <div className="flex items-center gap-4">
        <div className="text-[#141C25] text-[28px] font-medium leading-9 tracking-[-0.28px]">
          {value}
        </div>
        <div className="flex flex-col justify-center items-start">
          <div className="flex items-center gap-1">
            <ArrowUpCircle className="w-4 h-4 text-[#059669]" />
            <span className="text-[#059669] text-sm font-medium leading-5 capitalize">
              {change}%
            </span>
          </div>
          <div className="text-[#344051] text-sm font-normal leading-5 capitalize">
            {changeLabel}
          </div>
        </div>
      </div>
    </div>
  )
}
