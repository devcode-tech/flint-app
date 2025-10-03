'use client'

import React from 'react'
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'
import type { LineChartDataPoint } from '@/types/dashboard'

interface LineChartProps {
  data: LineChartDataPoint[]
  height?: number
}

export const LineChart: React.FC<LineChartProps> = ({ data, height = 247 }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          <Line 
            type="monotone" 
            dataKey="newUsers" 
            stroke="#8B5CF6" 
            strokeWidth={2}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="existingUsers" 
            stroke="#CED2DA" 
            strokeWidth={2}
            dot={false}
          />
          <Legend 
            content={({ payload }) => (
              <div className="flex justify-center items-start gap-1 flex-wrap mt-6">
                {payload?.map((entry, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full border-2 mr-1"
                      style={{ borderColor: entry.color }}
                    />
                    <span className="text-xs text-[#344051] capitalize">
                      {entry.value === 'newUsers' ? 'New Users' : 'Existing Users'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}
