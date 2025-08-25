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
      players: {
        Row: {
          id: string
          name: string
          kitTiers: Json
          peakTiers: Json | null
          avatar: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          kitTiers?: Json
          peakTiers?: Json | null
          avatar?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          kitTiers?: Json
          peakTiers?: Json | null
          avatar?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}