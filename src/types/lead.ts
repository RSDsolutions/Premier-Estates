export interface Lead {
  id: string
  property_id?: string
  agent_id?: string
  name: string
  email: string
  phone?: string
  message?: string
  source: string
  status: 'new' | 'contacted' | 'qualified' | 'discarded'
  created_at: string
  updated_at: string
}
