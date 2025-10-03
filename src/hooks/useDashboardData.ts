'use client'

import { useQuery } from '@tanstack/react-query'
import type { MetricData, ChartDataPoint, LineChartDataPoint } from '@/types/dashboard'

// Mock API functions - replace with actual API calls
const fetchMetrics = async (): Promise<MetricData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return [
    {
      id: '1',
      title: 'Total Contests',
      value: '65',
      change: 12,
      changeType: 'increase',
      icon: 'cart'
    },
    {
      id: '2',
      title: 'Total Emails',
      value: '$5,235.00',
      change: 12,
      changeType: 'increase',
      icon: 'money'
    },
    {
      id: '3',
      title: 'New Users',
      value: '1,732',
      change: 12,
      changeType: 'increase',
      icon: 'users'
    },
    {
      id: '4',
      title: 'Return Users Rate',
      value: '34%',
      change: 12,
      changeType: 'increase',
      icon: 'userCheck'
    }
  ]
}

const fetchBarChartData = async (timeRange: string): Promise<ChartDataPoint[]> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const data: ChartDataPoint[] = []
  for (let i = 1; i <= 31; i++) {
    data.push({
      date: i.toString().padStart(2, '0'),
      desktop: Math.floor(Math.random() * 3000) + 1000,
      mobile: Math.floor(Math.random() * 2500) + 800,
      tablet: Math.floor(Math.random() * 1500) + 500
    })
  }
  return data
}

const fetchLineChartData = async (timeRange: string): Promise<LineChartDataPoint[]> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const data: LineChartDataPoint[] = []
  for (let i = 1; i <= 31; i++) {
    data.push({
      date: i.toString().padStart(2, '0'),
      newUsers: Math.floor(Math.random() * 2000) + 500,
      existingUsers: Math.floor(Math.random() * 1800) + 400
    })
  }
  return data
}

// Custom hooks
export const useMetrics = () => {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: fetchMetrics,
  })
}

export const useBarChartData = (timeRange: string) => {
  return useQuery({
    queryKey: ['barChart', timeRange],
    queryFn: () => fetchBarChartData(timeRange),
  })
}

export const useLineChartData = (timeRange: string) => {
  return useQuery({
    queryKey: ['lineChart', timeRange],
    queryFn: () => fetchLineChartData(timeRange),
  })
}
