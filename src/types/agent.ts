export interface Agent {
  id: string
  user_id: string
  agency_id?: string
  full_name: string
  email?: string
  phone?: string
  whatsapp?: string
  photo_url?: string
  bio?: string
  license_number?: string
  specialties: string[]
  listings_count: number
  active: boolean
}
