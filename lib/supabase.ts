import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      churches: {
        Row: {
          id: string
          name: string
          contact_person: string | null
          contact_email: string | null
          contact_phone: string | null
          member_limit: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          contact_person?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          member_limit?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          contact_person?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          member_limit?: number
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          role: "admin" | "monitor" | "attendee"
          church_id: string | null
          is_accredited: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          phone?: string | null
          role?: "admin" | "monitor" | "attendee"
          church_id?: string | null
          is_accredited?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          role?: "admin" | "monitor" | "attendee"
          church_id?: string | null
          is_accredited?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tickets: {
        Row: {
          id: string
          user_id: string
          ticket_type: "lunch" | "dinner" | "snack"
          qr_code: string
          is_used: boolean
          used_at: string | null
          used_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ticket_type?: "lunch" | "dinner" | "snack"
          qr_code: string
          is_used?: boolean
          used_at?: string | null
          used_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ticket_type?: "lunch" | "dinner" | "snack"
          qr_code?: string
          is_used?: boolean
          used_at?: string | null
          used_by?: string | null
          created_at?: string
        }
      }
    }
  }
}
