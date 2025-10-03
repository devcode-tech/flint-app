import React from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/atoms/Tabs'
import type { TimeRange } from '@/types/dashboard'

interface TimeRangeTabsProps {
  timeRanges: TimeRange[]
  defaultValue?: string
  onValueChange?: (value: string) => void
}

export const TimeRangeTabs: React.FC<TimeRangeTabsProps> = ({
  timeRanges,
  defaultValue = '1D',
  onValueChange
}) => {
  return (
    <Tabs defaultValue={defaultValue} onValueChange={onValueChange}>
      <TabsList>
        {timeRanges.map((range) => (
          <TabsTrigger key={range.value} value={range.value}>
            {range.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
