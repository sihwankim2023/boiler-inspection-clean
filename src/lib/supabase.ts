import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mtemiwchrwrfbvxnxggd.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10ZW1pd2NocndyZmJ2eG54Z2dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMjU3MjYsImV4cCI6MjA1MTkwMTcyNn0.3WGQNzRNjGnx6JRPvIKHwKXPqSQFzjJWNLQnM7LcQZQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 점검 데이터 타입
export interface Inspection {
  id: string
  inspection_date: string
  inspector: string
  site_name: string
  address: string
  result: string
  summary?: string
  created_at: string
}

// 점검 데이터 저장
export async function saveInspection(data: Omit<Inspection, 'id' | 'created_at'>) {
  const { data: result, error } = await supabase
    .from('inspections')
    .insert([data])
    .select()
    .single()

  if (error) throw error
  return result
}

// 점검 데이터 조회
export async function getInspections() {
  const { data, error } = await supabase
    .from('inspections')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}