import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAppStore } from '../store'

export function useAuth() {
  const { user, profile, setAuthModalOpen } = useAppStore()

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured()) {
      toast('Configura Supabase para usar autenticación real')
      return { error: null }
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) toast.error(error.message)
    else {
      toast.success('¡Cuenta creada! Revisa tu correo para confirmar.')
      setAuthModalOpen(false)
    }
    return { error }
  }, [setAuthModalOpen])

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      toast('Configura Supabase para usar autenticación real')
      return { error: null }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) toast.error('Credenciales incorrectas')
    else {
      toast.success('¡Bienvenido de vuelta!')
      setAuthModalOpen(false)
    }
    return { error }
  }, [setAuthModalOpen])

  const signInWithGoogle = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      toast('Configura Supabase para usar Google OAuth')
      return
    }
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/admin` },
    })
  }, [])

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured()) await supabase.auth.signOut()
    toast('Sesión cerrada')
  }, [])

  return { user, profile, signUp, signIn, signInWithGoogle, signOut }
}
