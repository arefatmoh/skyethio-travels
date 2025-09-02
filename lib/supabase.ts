import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface Booking {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  passport_number: string
  departure_city: string
  destination: string
  departure_date: string
  return_date: string | null
  trip_type: 'round-trip' | 'one-way'
  passengers: number
  travel_class: 'economy' | 'business' | 'first'
  preferred_airline: string | null
  notes: string | null
  passport_file_url: string | null
  total_amount: number
  status: 'pending' | 'confirmed' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'refunded'
  created_at: string
}

export interface VisaApplication {
  id: string
  applicant_name: string
  applicant_email: string
  visa_type: string
  duration: string
  age: number
  birth_year: number
  passport_number: string
  additional_notes: string | null
  passport_file_url: string | null
  bank_statement_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  application_date: string
  created_at: string
}

export interface ContactInquiry {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied'
  created_at: string
}

export interface Ad {
  id: string
  title: string
  description: string | null
  ad_type: 'banner' | 'popup' | 'slide-in' | 'floating' | 'notification'
  content_type: 'promotional' | 'offer' | 'announcement' | 'service'
  image_url: string | null
  video_url: string | null
  cta_text: string
  cta_url: string
  target_pages: string[]
  target_audience: 'all' | 'new_visitors' | 'returning_visitors'
  priority: number
  is_active: boolean
  start_date: string | null
  end_date: string | null
  max_impressions: number | null
  current_impressions: number
  click_count: number
  created_by: string
  created_at: string
  updated_at: string
}
