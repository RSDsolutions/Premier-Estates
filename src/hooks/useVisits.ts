import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAppStore } from '../store'
import type { Visit } from '../types'

export function useVisits(agentMode = false) {
  const { user } = useAppStore()
  const [visits, setVisits] = useState<Visit[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!isSupabaseConfigured() || !user) return
    setLoading(true)
    const query = supabase
      .from('visits')
      .select('*, property:properties(id,title,zone,type,area,beds)')
      .order('visit_date', { ascending: true })

    if (agentMode) {
      query.eq('agent_id', user.id)
    } else {
      query.eq('user_id', user.id)
    }

    const { data } = await query
    if (data) setVisits(data as Visit[])
    setLoading(false)
  }, [user, agentMode])

  useEffect(() => { void load() }, [load])

  const updateStatus = useCallback(async (id: string, status: Visit['status']) => {
    setVisits(vs => vs.map(v => v.id === id ? { ...v, status } : v))
    if (isSupabaseConfigured()) {
      await supabase.from('visits').update({ status }).eq('id', id)
    }
  }, [])

  const cancelVisit = useCallback(async (id: string) => {
    await updateStatus(id, 'cancelled')
  }, [updateStatus])

  return { visits, loading, updateStatus, cancelVisit, reload: load }
}
