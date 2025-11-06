import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface User {
  id: string
  email: string
  name: string
  is_premium: boolean
  premium_expires_at?: string
  kirvano_customer_id?: string
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  kirvano_payment_id: string
  plan_type: 'monthly' | 'quarterly' | 'semiannual' | 'annual'
  status: 'active' | 'cancelled' | 'expired'
  amount: number
  currency: string
  starts_at: string
  expires_at: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  user_id: string
  subscription_id?: string
  kirvano_payment_id: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_method: string
  created_at: string
  updated_at: string
}