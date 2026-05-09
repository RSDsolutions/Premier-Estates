import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { photoUrl } from '../lib/mockData'
import type { Property, SearchFilters } from '../types'
import toast from 'react-hot-toast'

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProperties()

    if (isSupabaseConfigured()) {
      const channel = supabase.channel('properties_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, (payload) => {
          if (payload.eventType === 'UPDATE') {
            setProperties(prev => prev.map(p => p.id === payload.new.id ? { ...p, ...payload.new as Property } : p))
          } else if (payload.eventType === 'INSERT') {
            if (payload.new.status === 'active') {
              setProperties(prev => [payload.new as Property, ...prev])
            }
          } else if (payload.eventType === 'DELETE') {
            setProperties(prev => prev.filter(p => p.id !== payload.old?.id))
          }
        }).subscribe()

      return () => { supabase.removeChannel(channel) }
    }
  }, [])

  async function loadProperties() {
    setLoading(true)
    if (!isSupabaseConfigured()) {
      setProperties([])
      setLoading(false)
      return
    }
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching properties', error)
      toast.error('Error al cargar propiedades')
    } else if (data) {
      setProperties(data as Property[])
    }
    setLoading(false)
  }

  const getProperty = useCallback((id: string): Property | undefined => {
    return properties.find(p => p.id === id)
  }, [properties])

  const filterProperties = useCallback((filters: Partial<SearchFilters>): Property[] => {
    let arr = [...properties]
    if (filters.type) arr = arr.filter(p => p.type === filters.type)
    if (filters.zone) {
      const q = filters.zone.toLowerCase()
      arr = arr.filter(p => p.zone.toLowerCase().includes(q) || p.title.toLowerCase().includes(q))
    }
    if (filters.operation) arr = arr.filter(p => p.operation === filters.operation)
    if (filters.beds) arr = arr.filter(p => p.beds >= Number(filters.beds))
    if (filters.baths) arr = arr.filter(p => p.baths >= Number(filters.baths))
    if (filters.minArea) arr = arr.filter(p => p.area >= (filters.minArea ?? 0))
    if (filters.features?.length) {
      arr = arr.filter(p => (filters.features ?? []).every(f => p.amenities?.includes(f)))
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      arr = arr.filter(p => p.price >= (filters.minPrice ?? 0) && p.price <= (filters.maxPrice ?? Infinity))
    }
    if (filters.sort === 'asc') arr.sort((a, b) => a.price - b.price)
    if (filters.sort === 'desc') arr.sort((a, b) => b.price - a.price)
    return arr
  }, [properties])

  const createProperty = useCallback(async (data: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
    if (!isSupabaseConfigured()) {
      const newProp: Property = { ...data, id: String(Date.now()), amenities: data.amenities ?? [] }
      setProperties(prev => [newProp, ...prev])
      toast.success('Propiedad agregada')
      return newProp
    }
    const { data: created, error } = await supabase
      .from('properties')
      .insert(data)
      .select()
      .single()
    if (error) { toast.error('Error al crear propiedad'); return null }
    setProperties(prev => [created as Property, ...prev])
    toast.success('Propiedad publicada')
    return created as Property
  }, [])

  const updateProperty = useCallback(async (id: string, data: Partial<Omit<Property, 'id' | 'created_at' | 'updated_at'>>) => {
    if (!isSupabaseConfigured()) {
      setProperties(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
      toast.success('Propiedad actualizada')
      return
    }
    const { error } = await supabase.from('properties').update(data).eq('id', id)
    if (error) { toast.error('Error al actualizar'); return }
    setProperties(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
    toast.success('Propiedad actualizada')
  }, [])

  const deleteProperty = useCallback(async (id: string) => {
    if (!confirm('¿Eliminar esta propiedad?')) return
    if (!isSupabaseConfigured()) {
      setProperties(prev => prev.filter(p => p.id !== id))
      toast.success('Propiedad eliminada')
      return
    }
    const { error } = await supabase.from('properties').delete().eq('id', id)
    if (error) { toast.error('Error al eliminar'); return }
    setProperties(prev => prev.filter(p => p.id !== id))
    toast.success('Propiedad eliminada')
  }, [])

  return { properties, loading, getProperty, filterProperties, createProperty, updateProperty, deleteProperty, photoUrl, reload: loadProperties }
}
