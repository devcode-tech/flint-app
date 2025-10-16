'use client'

import React, { useState, memo } from 'react'
import { Card, CardContent } from '@/components/atoms/Card'
import { MetricCard } from '@/components/molecules/MetricCard'
import { TimeRangeTabs } from '@/components/molecules/TimeRangeTabs'
import { BarChart } from '@/components/molecules/BarChart'
import { LineChart } from '@/components/molecules/LineChart'
import { ChartHeader } from '@/components/molecules/ChartHeader'
import { MetricCardSkeleton } from '@/components/molecules/MetricCardSkeleton'
import { ChartSkeleton } from '@/components/molecules/ChartSkeleton'
import { ErrorMessage } from '@/components/atoms/ErrorMessage'
import { useMetrics, useBarChartData, useLineChartData } from '@/hooks/useDashboardData'
import type { TimeRange } from '@/types/dashboard'

// Time ranges configuration

const timeRanges: TimeRange[] = [
  { label: '1D', value: '1D' },
  { label: '7D', value: '7D' },
  { label: '1M', value: '1M' },
  { label: '3M', value: '3M' },
  { label: '1Y', value: '1Y' },
  { label: 'Custom', value: 'Custom' }
]

export const DashboardContent: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('1D')
  const [chartTimeRange, setChartTimeRange] = useState('1 Month')
  
  // Data fetching hooks
  const { data: metricsData, isLoading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useMetrics()
  const { data: barChartData, isLoading: barChartLoading, error: barChartError, refetch: refetchBarChart } = useBarChartData(chartTimeRange)
  const { data: lineChartData, isLoading: lineChartLoading, error: lineChartError, refetch: refetchLineChart } = useLineChartData(selectedTimeRange)

  return (
    <div className="flex w-full max-w-7xl mx-auto p-4 lg:p-8 flex-col items-start gap-6 bg-white min-h-screen">
      {/* Performance Section */}
      <div className="flex pb-3 items-start self-stretch">
        <div className="flex p-0 flex-col items-start gap-4 flex-1 rounded-2xl">
          {/* Section Header */}
          <div className="flex py-4 justify-between items-center self-stretch flex-wrap gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex flex-col justify-center items-start">
                <h2 className="text-[#141C25] text-lg font-medium leading-7">
                  Performance
                </h2>
              </div>
            </div>
            <TimeRangeTabs 
              timeRanges={timeRanges}
              defaultValue={selectedTimeRange}
              onValueChange={setSelectedTimeRange}
            />
          </div>

          {/* Metrics Cards */}
          <div className="flex flex-col sm:flex-row items-start gap-4 lg:gap-6 self-stretch">
            {metricsLoading ? (
              // Loading skeletons
              [...Array(4)].map((_, index) => (
                <div key={index} className="flex-1 w-full">
                  <MetricCardSkeleton />
                </div>
              ))
            ) : metricsError ? (
              // Error state
              <div className="flex-1 w-full">
                <ErrorMessage 
                  message="Failed to load metrics data"
                  onRetry={refetchMetrics}
                />
              </div>
            ) : (
              // Data loaded successfully
              metricsData?.map((metric) => (
                <div key={metric.id} className="flex-1 w-full">
                  <MetricCard data={metric} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px self-stretch bg-[#E4E7EC]" />

      {/* Contest Views Chart */}
      <div className="flex items-start gap-6 self-stretch">
        {barChartLoading ? (
          <div className="flex-1">
            <ChartSkeleton height={247} showHeader={true} />
          </div>
        ) : barChartError ? (
          <Card className="flex p-6 flex-col items-start gap-4 flex-1 rounded-2xl border border-[#E4E7EC] bg-white shadow-sm">
            <CardContent className="p-0 w-full">
              <ErrorMessage 
                message="Failed to load chart data"
                onRetry={refetchBarChart}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="flex p-6 flex-col items-start gap-4 flex-1 rounded-2xl border border-[#E4E7EC] bg-white shadow-sm">
            <CardContent className="p-0 w-full">
              <ChartHeader
                title="Contest Views"
                value="1,732"
                change={12}
                timeRangeButtons={['24 Hours', '7 Days', '1 Month', '6 Months', '1 Year']}
                selectedTimeRange={chartTimeRange}
                onTimeRangeChange={setChartTimeRange}
              />
              <div className="mt-6">
                {barChartData && <BarChart data={barChartData} />}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Divider */}
      <div className="h-px self-stretch bg-[#E4E7EC]" />

      {/* Email Collected Section */}
      <div className="flex pb-3 items-start self-stretch">
        <div className="flex p-0 flex-col items-start gap-1 flex-1 rounded-2xl">
          {/* Section Header */}
          <div className="flex py-3 justify-between items-center self-stretch flex-wrap gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex flex-col justify-center items-start">
                <h2 className="text-[#141C25] text-lg font-medium leading-7">
                  Email Collected
                </h2>
              </div>
            </div>
            <TimeRangeTabs 
              timeRanges={timeRanges}
              defaultValue={selectedTimeRange}
              onValueChange={setSelectedTimeRange}
            />
          </div>

          {/* Line Chart */}
          {lineChartLoading ? (
            <div className="w-full">
              <ChartSkeleton height={247} showHeader={false} />
            </div>
          ) : lineChartError ? (
            <Card className="flex p-6 flex-col items-start gap-6 self-stretch rounded-2xl border border-[#E4E7EC] bg-white shadow-sm">
              <CardContent className="p-0 w-full">
                <ErrorMessage 
                  message="Failed to load email collection data"
                  onRetry={refetchLineChart}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="flex p-6 flex-col items-start gap-6 self-stretch rounded-2xl border border-[#E4E7EC] bg-white shadow-sm">
              <CardContent className="p-0 w-full">
                <div className="mt-6">
                  {lineChartData && <LineChart data={lineChartData} />}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
