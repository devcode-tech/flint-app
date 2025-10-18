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
  // Actions fields
  reward_type?: string
  reward_option?: string
  // Post capture fields
  capture_behaviour?: string
  capture_autoclose?: string
  post_capture_content?: string // Markdown content for post-capture message
  // Legacy post capture fields (deprecated - kept for backward compatibility)
  capture_title?: string
  capture_description?: string
  capture_url?: string
  // Post contest field
  end_contest?: string // Markdown content for after contest ends message
  // Targeting fields
  audience_segments?: string[]
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
