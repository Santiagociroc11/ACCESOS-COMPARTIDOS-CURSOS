export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string
          name: string
          url: string
          username: string
          password: string
          requires_dynamic_pin: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          url: string
          username: string
          password: string
          requires_dynamic_pin?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          url?: string
          username?: string
          password?: string
          requires_dynamic_pin?: boolean
          created_at?: string
        }
      }
    }
  }
}