export interface Contest {
  id: string
  name: string
  status: 'active' | 'inactive'
  createdDate: string
  impression: number
  conversion: number
  conversionRate: number
}

export interface ContestFilters {
  tab: 'active' | 'completed' | 'drafts' | 'scheduled'
  search: string
  dateRange: string
}

export interface ContestTableProps {
  contests: Contest[]
  onStatusToggle: (contestId: string, status: boolean) => void
  onView: (contestId: string) => void
  onAction: (contestId: string, action: string) => void
}
