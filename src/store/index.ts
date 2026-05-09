import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import type { Profile, Notification, Property } from '../types'

interface AppStore {
  user: User | null
  profile: Profile | null
  notifications: Notification[]
  favorites: Set<string>
  currentPropertyId: string | null
  paymentProperty: Property | null
  authModalOpen: boolean
  navOpen: boolean

  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setNotifications: (notifs: Notification[]) => void
  addNotification: (n: Notification) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  toggleFavorite: (propertyId: string) => void
  isFavorite: (propertyId: string) => boolean
  setCurrentProperty: (id: string | null) => void
  setPaymentProperty: (p: Property | null) => void
  setAuthModalOpen: (open: boolean) => void
  setNavOpen: (open: boolean) => void
}

const loadFavs = (): Set<string> => {
  try {
    const raw = localStorage.getItem('pe-favs')
    return raw ? new Set<string>(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

const saveFavs = (favs: Set<string>) => {
  localStorage.setItem('pe-favs', JSON.stringify([...favs]))
}

export const useAppStore = create<AppStore>((set, get) => ({
  user: null,
  profile: null,
  notifications: [],
  favorites: loadFavs(),
  currentPropertyId: null,
  paymentProperty: null,
  authModalOpen: false,
  navOpen: false,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setNotifications: (notifications) => set({ notifications }),

  addNotification: (n) =>
    set((s) => ({ notifications: [n, ...s.notifications] })),

  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAllNotificationsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),

  toggleFavorite: (propertyId) => {
    const favs = new Set(get().favorites)
    if (favs.has(propertyId)) {
      favs.delete(propertyId)
    } else {
      favs.add(propertyId)
    }
    saveFavs(favs)
    set({ favorites: favs })
  },

  isFavorite: (propertyId) => get().favorites.has(propertyId),

  setCurrentProperty: (id) => set({ currentPropertyId: id }),
  setPaymentProperty: (p) => set({ paymentProperty: p }),
  setAuthModalOpen: (open) => set({ authModalOpen: open }),
  setNavOpen: (open) => set({ navOpen: open }),
}))
