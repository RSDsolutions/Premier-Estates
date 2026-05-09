import { supabase } from './supabase'

export function generateMLSNumber(): string {
  // Helper de UI para código preliminar
  const currentYear = new Date().getFullYear()
  const randomSeq = Math.floor(Math.random() * 9000) + 1000
  return `MLS-${currentYear}-${randomSeq}`
}

export async function transitionPropertyStatus(id: string, newStatus: string, agentId?: string) {
  const { data: prop, error: fetchErr } = await supabase.from('properties').select('status, agent_id').eq('id', id).single()
  if (fetchErr || !prop) throw new Error('Propiedad no encontrada')
  
  const validTransitions: Record<string, string[]> = {
    active: ['pending', 'inactive'],
    pending: ['sold', 'rented', 'active', 'inactive'],
    sold: [],
    rented: [],
    inactive: ['active']
  }

  if (!validTransitions[prop.status]?.includes(newStatus)) {
    throw new Error(`Transición no válida de ${prop.status} a ${newStatus}`)
  }

  const { error } = await supabase.from('properties').update({ status: newStatus }).eq('id', id)
  if (error) throw error
  return true
}

export function mapRESOtoInternal(resoPayload: any) {
  return {
    mls_number: resoPayload.ListingId,
    title: resoPayload.PublicRemarks?.substring(0, 100) || 'Propiedad MLS',
    price: resoPayload.ListPrice,
    status: resoPayload.StandardStatus === 'Active' ? 'active' : 'inactive',
    area_total: resoPayload.LivingArea,
    bedrooms: resoPayload.BedroomsTotal,
    bathrooms: resoPayload.BathroomsTotalInteger,
    year_built: resoPayload.YearBuilt,
    operation_type: resoPayload.PropertyType === 'Residential Lease' ? 'rent' : 'sale'
  }
}

export function buildPropertyQuery(filters: any) {
  let query = supabase.from('properties').select('*')
  
  if (filters.status) query = query.eq('status', filters.status)
  else query = query.eq('status', 'active')

  if (filters.operation) query = query.eq('operation_type', filters.operation)
  if (filters.type) query = query.eq('property_type', filters.type)
  if (filters.zone) query = query.ilike('zone', `%${filters.zone}%`)
  if (filters.beds) query = query.gte('bedrooms', filters.beds)
  
  if (filters.minPrice) query = query.gte('price', filters.minPrice)
  if (filters.maxPrice) query = query.lte('price', filters.maxPrice)

  return query
}

export async function trackLeadSource(propertyId: string, source: string) {
  // Log source origin for external campaigns
  return { propertyId, source, trackedAt: new Date().toISOString() }
}
