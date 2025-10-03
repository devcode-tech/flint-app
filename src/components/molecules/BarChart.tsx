'use client'

import React from 'react'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'
import type { ChartDataPoint } from '@/types/dashboard'

interface BarChartProps {
  data: ChartDataPoint[]
  height?: number
}

export const BarChart: React.FC<BarChartProps> = ({ data, height = 247 }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} maxBarSize={20}>
          <CartesianGrid strokeDasharray="5 5" stroke="#E4E7EC" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#637083' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#637083' }}
          />
          <Bar dataKey="tablet" stackId="a" fill="#6366F1" radius={[0, 0, 0, 0]} />
          <Bar dataKey="mobile" stackId="a" fill="#36BFFA" radius={[0, 0, 0, 0]} />
          <Bar dataKey="desktop" stackId="a" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          <Legend 
            content={({ payload }) => (
              <div className="flex justify-center items-start gap-1 flex-wrap mt-6">
                {payload?.map((entry, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-1"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs text-[#344051] capitalize">
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
