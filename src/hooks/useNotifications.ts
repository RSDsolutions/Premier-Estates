import { useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAppStore } from '../store'
import type { Notification } from '../types'

export function useNotifications() {
  const { user, notifications, setNotifications, addNotification, markNotificationRead, markAllNotificationsRead } = useAppStore()
  const unreadCount = notifications.filter(n => !n.read).length

  // Load existing notifications from DB on mount
  useEffect(() => {
    if (!isSupabaseConfigured() || !user) return
    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data?.length) setNotifications(data as Notification[])
      })
  }, [user, setNotifications])

  // Realtime: listen for new notifications inserted by DB triggers
  useEffect(() => {
    if (!isSupabaseConfigured() || !user) return
    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => { addNotification(payload.new as Notification) }
      )
      .subscribe()
    return () => { void supabase.removeChannel(channel) }
  }, [user, addNotification])

  // Persist mark-as-read to DB
  const markRead = useCallback(async (id: string) => {
    markNotificationRead(id)
    if (isSupabaseConfigured()) {
      await supabase.from('notifications').update({ read: true }).eq('id', id)
    }
  }, [markNotificationRead])

  const markAllRead = useCallback(async () => {
    markAllNotificationsRead()
    if (isSupabaseConfigured() && user) {
      await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false)
    }
  }, [markAllNotificationsRead, user])

  return { notifications, unreadCount, markNotificationRead: markRead, markAllNotificationsRead: markAllRead }
}
