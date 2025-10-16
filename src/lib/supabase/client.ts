import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Database Types
export interface Form {
  id: string // UUID
  form_title: string
  form_description: string
  fields: any[]
  containers: any[]
  design: any
  created_at: string
  updated_at: string
}

export interface Contest {
  id: string // UUID - for internal operations
  embed_id: string // AS12FS - for public embedding
  name: string
  contest_type: string
  start_date: string
  end_date: string
  form_id: string | null
  actions: any
  post_capture: any
  targeting: any
  status: 'draft' | 'active' | 'completed' | 'archived'
  created_at: string
  updated_at: string
  form?: Form // Joined data
}
