import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAppStore } from '../store'
import type { Message } from '../types'

interface MockMessage extends Message {
  isMock?: boolean
}

const MOCK_MESSAGES: MockMessage[] = [
  { id: '1', sender_id: 'agent', receiver_id: 'user', content: '¡Hola! ¿En qué puedo ayudarte hoy?', read: true, created_at: new Date(Date.now() - 60000).toISOString(), isMock: true },
]

export function useChat(propertyId?: string) {
  const { user } = useAppStore()
  const [messages, setMessages] = useState<MockMessage[]>(MOCK_MESSAGES)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured() || !user || !propertyId) return

    supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .eq('property_id', propertyId)
      .order('created_at')
      .then(({ data }) => {
        if (data?.length) setMessages(data as Message[])
      })

    const channel = supabase
      .channel(`chat-${propertyId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `property_id=eq.${propertyId}`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => { void supabase.removeChannel(channel) }
  }, [user, propertyId])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return
    setSending(true)

    if (!isSupabaseConfigured() || !user) {
      const mock: MockMessage = {
        id: String(Date.now()),
        sender_id: 'user',
        receiver_id: 'agent',
        content,
        read: false,
        created_at: new Date().toISOString(),
        isMock: true,
      }
      setMessages(prev => [...prev, mock])
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: String(Date.now() + 1),
          sender_id: 'agent',
          receiver_id: 'user',
          content: 'Gracias por tu mensaje. Carlos te responderá en breve.',
          read: false,
          created_at: new Date().toISOString(),
          isMock: true,
        }])
      }, 1200)
    } else {
      await supabase.from('messages').insert({
        property_id: propertyId,
        sender_id: user.id,
        receiver_id: 'agent-placeholder-id',
        content,
      })
    }
    setSending(false)
  }, [user, propertyId])

  const isOwnMessage = (msg: MockMessage) => {
    if (msg.isMock) return msg.sender_id === 'user'
    return msg.sender_id === user?.id
  }

  return { messages, sending, sendMessage, isOwnMessage }
}
