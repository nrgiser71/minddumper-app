import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Profile {
  id: string
  created_at: string
  updated_at: string
  email?: string
  full_name?: string
  language: string
}

export interface BrainDump {
  id: string
  user_id: string
  created_at: string
  language: string
  total_ideas: number
  total_words: number
  duration_minutes: number
  ideas: string[]
  metadata: Record<string, unknown>
}

export interface TriggerWord {
  id: string
  language: string
  word: string
  category?: string
  is_active: boolean
  created_at: string
}