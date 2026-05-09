export interface Property {
  id: string
  agent_id?: string | null
  title: string
  description?: string | null
  type: 'Casa' | 'Departamento' | 'Oficina' | 'Local'
  operation: 'Venta' | 'Arriendo'
  price: number
  zone: string
  beds: number
  baths: number
  area: number
  year: number
  featured: boolean
  status?: 'active' | 'sold' | 'rented' | 'inactive'
  amenities: string[]
  photos?: string[]
  videos?: string[]
  location?: { lat: number; lng: number } | null
  address?: string | null
  created_at?: string
  updated_at?: string
  pin?: { x: number; y: number }
}

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  role: 'buyer' | 'agent' | 'admin'
  created_at: string
}

export interface Visit {
  id: string
  property_id: string
  user_id: string
  agent_id?: string | null
  visit_date: string
  visit_time: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes?: string | null
  created_at?: string
  property?: Property
}

export interface Notification {
  id: string
  user_id?: string
  title: string
  body?: string | null
  type?: string | null
  read: boolean
  data?: Record<string, unknown> | null
  created_at?: string
  icn?: string
  time?: string
}

export interface Message {
  id: string
  property_id?: string
  sender_id: string
  receiver_id: string
  content: string
  read: boolean
  created_at?: string
  sender?: Profile
}

export interface Payment {
  id: string
  user_id?: string
  property_id?: string | null
  stripe_payment_intent_id?: string | null
  amount: number
  currency?: string
  status?: string | null
  description?: string | null
  created_at?: string
}

export interface Document {
  id: string
  property_id?: string | null
  user_id?: string
  docuseal_submission_id?: string | null
  doc_type?: string
  status: 'pending' | 'signed' | 'rejected'
  signed_at?: string | null
  created_at?: string
}

export interface SearchFilters {
  type: string
  zone: string
  operation: string
  minPrice: number
  maxPrice: number
  beds: string
  baths: string
  minArea: number
  features: string[]
  sort: 'recent' | 'asc' | 'desc'
}

export interface AdminClient {
  id: string
  name: string
  meta: string
  seed: string
}

export interface AdminVisitRow {
  client: string
  property: string
  date: string
  time: string
  status: 'Confirmada' | 'Pendiente' | 'Cancelada'
}
