import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAppStore } from '../store'

export function useFavorites() {
  const { user, favorites, toggleFavorite, isFavorite } = useAppStore()

  const toggle = useCallback(async (propertyId: string) => {
    const wasFav = isFavorite(propertyId)
    toggleFavorite(propertyId)
    toast(wasFav ? 'Eliminado de favoritos' : 'Añadido a favoritos')

    if (!isSupabaseConfigured() || !user) return

    if (wasFav) {
      await supabase.from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId)
    } else {
      await supabase.from('favorites')
        .insert({ user_id: user.id, property_id: propertyId })
    }
  }, [user, isFavorite, toggleFavorite])

  return { favorites, toggle, isFavorite }
}
