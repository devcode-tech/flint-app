export interface Contest {
  id: string
  name: string
  contest_type: string
  start_date: string
  end_date: string
  form_schema_id?: string
  status?: string
  created_at?: string
  updated_at?: string
  // Optional display fields
  createdDate?: string
  impression?: number
  conversion?: number
  conversionRate?: number
}

export interface ContestFilters {
  tab: 'all' | 'active' | 'draft' | 'completed' | 'scheduled'
  search: string
  dateRange: string
}

export interface ContestTableProps {
  contests: Contest[]
  onStatusToggle: (contestId: string, status: boolean) => void
  onView: (contestId: string) => void
  onAction: (contestId: string, action: string) => void
}
