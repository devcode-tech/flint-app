export interface MetricData {
  id: string
  title: string
  value: string | number
  change: number
  changeType: 'increase' | 'decrease'
  icon: string
}

export interface ChartDataPoint {
  date: string
  desktop: number
  mobile: number
  tablet: number
}

export interface LineChartDataPoint {
  date: string
  newUsers: number
  existingUsers: number
}

export interface TimeRange {
  label: string
  value: string
  active?: boolean
}

export interface NavigationItem {
  id: string
  label: string
  icon: string
  href: string
  active?: boolean
  badge?: string
}
