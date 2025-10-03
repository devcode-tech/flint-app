export interface ContestFormData {
  name: string
  contestType: string
  startDate: string
  endDate: string
}

export interface ContestFormStep {
  id: string
  title: string
  status: 'completed' | 'current' | 'upcoming'
}

export interface ContestFormErrors {
  name?: string
  contestType?: string
  startDate?: string
  endDate?: string
}

export const contestTypeOptions = [
  { value: 'engagement', label: 'Engagement Mode' },
  { value: 'loyalty', label: 'Loyalty Mode' },
  { value: 'conversion', label: 'Conversion Mode' }
]

export const defaultFormData: ContestFormData = {
  name: '',
  contestType: '',
  startDate: '',
  endDate: ''
}
