import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Lead } from '../types/lead'

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('leads').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setLeads(data)
      setLoading(false)
    })
    
    const channel = supabase.channel('leads_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        supabase.from('leads').select('*').order('created_at', { ascending: false }).then(({ data }) => {
          if (data) setLeads(data)
        })
      }).subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return { leads, loading }
}
