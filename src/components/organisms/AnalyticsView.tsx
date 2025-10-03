'use client'

import React, { useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnalyticsViewProps {
  className?: string
}

interface MetricCardProps {
  title: string
  value: string
  percentage: string
  trend: 'up' | 'down'
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, percentage, trend }) => {
  return (
    <div className="flex py-5 px-4 items-center gap-6 flex-1 rounded-2xl border border-[#E4E7EC] bg-white">
      <div className="flex flex-col justify-center items-start gap-3 flex-1">
        <div className="flex justify-between items-end self-stretch">
          <div className="flex flex-col items-start gap-1">
            <div className="text-[#637083] text-sm font-normal leading-5 capitalize">
              {title}
            </div>
            <div className="text-[#141C25] text-2xl font-medium leading-8 tracking-[-0.24px]">
              {value}
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <ArrowUp className="w-4 h-4 text-[#10B978]" />
            <div className="text-[#10B978] text-sm font-medium leading-5 capitalize">
              {percentage}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const TimePeriodTabs: React.FC<{ activeTab: string; onTabChange: (tab: string) => void }> = ({ 
  activeTab, 
  onTabChange 
}) => {
  const tabs = ['1D', '7D', '1M', '3M', '1Y', 'Custom']
  
  return (
    <div className="flex py-0.5 px-0.5 items-start gap-1 rounded-lg bg-[#F2F4F7]">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={cn(
            "flex py-0.5 px-2 justify-center items-center gap-1.5 rounded-md text-sm font-medium leading-5 capitalize transition-colors",
            activeTab === tab
              ? "bg-white text-[#141C25] shadow-[0_1px_3px_0_rgba(20,28,37,0.05)]"
              : "text-[#637083] hover:text-[#141C25]"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

const ChartGrid: React.FC = () => {
  // Generate sample data for the chart
  const generateChartData = () => {
    const days = 31
    const data = []
    for (let i = 1; i <= days; i++) {
      data.push({
        day: i,
        newUsers: Math.floor(Math.random() * 2000 + 1500), // 1500-3500
        existingUsers: Math.floor(Math.random() * 1500 + 1000), // 1000-2500
      })
    }
    return data
  }

  const [chartData] = React.useState(generateChartData)
  const [hoveredPoint, setHoveredPoint] = React.useState<number | null>(null)
  
  const maxValue = 5000
  const chartWidth = 800
  const chartHeight = 200
  const padding = { left: 50, right: 20, top: 20, bottom: 40 }
  
  // Create smooth curve path
  const createSmoothPath = (data: number[], color: string) => {
    const points = data.map((value, index) => ({
      x: padding.left + (index / (data.length - 1)) * (chartWidth - padding.left - padding.right),
      y: padding.top + ((maxValue - value) / maxValue) * (chartHeight - padding.top - padding.bottom)
    }))
    
    let path = `M ${points[0].x} ${points[0].y}`
    
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1]
      const currentPoint = points[i]
      
      // Create smooth curve using quadratic bezier
      const cpx = (prevPoint.x + currentPoint.x) / 2
      const cpy = prevPoint.y
      
      path += ` Q ${cpx} ${cpy} ${currentPoint.x} ${currentPoint.y}`
    }
    
    return path
  }

  const newUsersData = chartData.map(d => d.newUsers)
  const existingUsersData = chartData.map(d => d.existingUsers)
  
  return (
    <div className="flex flex-col items-start gap-4 flex-1 self-stretch">
      {/* Chart Container */}
      <div className="relative w-full" style={{ height: `${chartHeight + 60}px` }}>
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${chartWidth} ${chartHeight + 60}`}
          className="overflow-visible"
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="newUsersGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.05"/>
            </linearGradient>
            <linearGradient id="existingUsersGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#CED2DA" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#CED2DA" stopOpacity="0.05"/>
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 1, 2, 3, 4, 5].map((_, index) => {
            const y = padding.top + (index / 5) * (chartHeight - padding.top - padding.bottom)
            const value = maxValue - (index / 5) * maxValue
            return (
              <g key={index}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#E4E7EC"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-[#637083]"
                  fontSize="12"
                >
                  {value.toLocaleString()}
                </text>
              </g>
            )
          })}
          
          {/* Chart areas and lines */}
          <g>
            {/* Area fills */}
            <path
              d={createSmoothPath(existingUsersData, '#CED2DA') + ` L ${chartWidth - padding.right} ${chartHeight - padding.bottom} L ${padding.left} ${chartHeight - padding.bottom} Z`}
              fill="url(#existingUsersGradient)"
              opacity="0.6"
            />
            <path
              d={createSmoothPath(newUsersData, '#8B5CF6') + ` L ${chartWidth - padding.right} ${chartHeight - padding.bottom} L ${padding.left} ${chartHeight - padding.bottom} Z`}
              fill="url(#newUsersGradient)"
              opacity="0.6"
            />
            
            {/* Chart lines */}
            <path
              d={createSmoothPath(existingUsersData, '#CED2DA')}
              fill="none"
              stroke="#CED2DA"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-sm"
            />
            
            <path
              d={createSmoothPath(newUsersData, '#8B5CF6')}
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-sm"
            />
            
            {/* Data points */}
            {chartData.map((data, index) => {
              const x = padding.left + (index / (chartData.length - 1)) * (chartWidth - padding.left - padding.right)
              const newUserY = padding.top + ((maxValue - data.newUsers) / maxValue) * (chartHeight - padding.top - padding.bottom)
              const existingUserY = padding.top + ((maxValue - data.existingUsers) / maxValue) * (chartHeight - padding.top - padding.bottom)
              
              return (
                <g key={index}>
                  {/* Hover area */}
                  <rect
                    x={x - 10}
                    y={padding.top}
                    width="20"
                    height={chartHeight - padding.top - padding.bottom}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(index)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  
                  {/* Data points */}
                  <>
                    <circle
                      cx={x}
                      cy={existingUserY}
                      r={hoveredPoint === index ? 5 : 2}
                      fill="#CED2DA"
                      stroke="white"
                      strokeWidth={hoveredPoint === index ? 3 : 2}
                      className="transition-all duration-200 drop-shadow-sm"
                      opacity={hoveredPoint === null || hoveredPoint === index ? 1 : 0.3}
                    />
                    <circle
                      cx={x}
                      cy={newUserY}
                      r={hoveredPoint === index ? 5 : 2}
                      fill="#8B5CF6"
                      stroke="white"
                      strokeWidth={hoveredPoint === index ? 3 : 2}
                      className="transition-all duration-200 drop-shadow-sm"
                      opacity={hoveredPoint === null || hoveredPoint === index ? 1 : 0.3}
                    />
                  </>
                  
                  {/* Tooltip */}
                  {hoveredPoint === index && (
                    <g>
                      {/* Tooltip background */}
                      <rect
                        x={x - 60}
                        y={Math.min(newUserY, existingUserY) - 60}
                        width="120"
                        height="50"
                        rx="8"
                        fill="rgba(0, 0, 0, 0.8)"
                        className="drop-shadow-lg"
                      />
                      {/* Tooltip text */}
                      <text
                        x={x}
                        y={Math.min(newUserY, existingUserY) - 40}
                        textAnchor="middle"
                        className="text-xs fill-white"
                        fontSize="11"
                      >
                        Day {data.day}
                      </text>
                      <text
                        x={x}
                        y={Math.min(newUserY, existingUserY) - 25}
                        textAnchor="middle"
                        className="text-xs fill-[#8B5CF6]"
                        fontSize="10"
                      >
                        New: {data.newUsers.toLocaleString()}
                      </text>
                      <text
                        x={x}
                        y={Math.min(newUserY, existingUserY) - 15}
                        textAnchor="middle"
                        className="text-xs fill-[#CED2DA]"
                        fontSize="10"
                      >
                        Existing: {data.existingUsers.toLocaleString()}
                      </text>
                    </g>
                  )}
                </g>
              )
            })}
          </g>
          
          {/* X-axis labels */}
          {[1, 5, 10, 15, 20, 25, 31].map((day, index) => {
            const x = padding.left + ((day - 1) / (chartData.length - 1)) * (chartWidth - padding.left - padding.right)
            return (
              <text
                key={index}
                x={x}
                y={chartHeight + 25}
                textAnchor="middle"
                className="text-xs fill-[#637083]"
                fontSize="12"
              >
                {day.toString().padStart(2, '0')}
              </text>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

const ChartLegend: React.FC = () => {
  return (
    <div className="flex justify-center items-center gap-6">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#8B5CF6] border-2 border-white shadow-sm"></div>
          <div className="w-4 h-0.5 bg-[#8B5CF6] rounded"></div>
        </div>
        <span className="text-[#344051] text-sm font-medium">
          New Users
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#CED2DA] border-2 border-white shadow-sm"></div>
          <div className="w-4 h-0.5 bg-[#CED2DA] rounded"></div>
        </div>
        <span className="text-[#344051] text-sm font-medium">
          Existing Users
        </span>
      </div>
    </div>
  )
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ className }) => {
  const [activeTimePeriod, setActiveTimePeriod] = useState('1D')

  const metrics = [
    { title: 'Impressions', value: '65,000', percentage: '12%', trend: 'up' as const },
    { title: 'Actions', value: '8,000', percentage: '12%', trend: 'up' as const },
    { title: 'Users', value: '1,732', percentage: '12%', trend: 'up' as const },
    { title: 'Conversation Rate', value: '34%', percentage: '12%', trend: 'up' as const },
  ]

  return (
    <div className={cn('flex w-full py-0 px-0 flex-col items-start gap-5 rounded-2xl', className)}>
      {/* Header */}
      <div className="flex py-3 px-0 justify-between items-center content-center gap-4 self-stretch flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col justify-center items-start">
            <div className="text-[#141C25] text-lg font-medium leading-7">
              Analytics
            </div>
          </div>
        </div>
        <TimePeriodTabs activeTab={activeTimePeriod} onTabChange={setActiveTimePeriod} />
      </div>

      {/* Metrics Cards */}
      <div className="flex items-start gap-6 self-stretch">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            percentage={metric.percentage}
            trend={metric.trend}
          />
        ))}
      </div>

      {/* Chart Section */}
      <div className="flex flex-col items-center gap-6 self-stretch">
        <div className="flex flex-col items-start gap-2.5 self-stretch p-6 bg-white rounded-2xl shadow-sm">
          <div className="flex justify-between items-center self-stretch mb-4">
            <h3 className="text-[#141C25] text-base font-medium">User Activity Trends</h3>
            <div className="text-[#637083] text-sm">Last 31 days</div>
          </div>
          <ChartGrid />
        </div>
        <ChartLegend />
      </div>
    </div>
  )
}

export default AnalyticsView
