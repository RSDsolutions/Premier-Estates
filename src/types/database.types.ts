import type { Property, Profile, Visit, Notification, Message, Payment, Document } from './index'

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: Property
        Insert: Omit<Property, 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Omit<Property, 'id' | 'created_at'>>
      }
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at'> & { id: string }
        Update: Partial<Omit<Profile, 'id'>>
      }
      visits: {
        Row: Visit
        Insert: Omit<Visit, 'id' | 'created_at'> & { id?: string }
        Update: Partial<Omit<Visit, 'id'>>
      }
      notifications: {
        Row: Notification
        Insert: Omit<Notification, 'id'> & { id?: string }
        Update: Partial<Omit<Notification, 'id'>>
      }
      messages: {
        Row: Message
        Insert: Omit<Message, 'id' | 'created_at'> & { id?: string }
        Update: Partial<Omit<Message, 'id'>>
      }
      payments: {
        Row: Payment
        Insert: Omit<Payment, 'id' | 'created_at'> & { id?: string }
        Update: Partial<Omit<Payment, 'id'>>
      }
      documents: {
        Row: Document
        Insert: Omit<Document, 'id' | 'created_at'> & { id?: string }
        Update: Partial<Omit<Document, 'id'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
