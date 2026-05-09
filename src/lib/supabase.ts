import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string || 'https://placeholder.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

export const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
  return !!(url && key && !url.includes('placeholder') && !url.includes('your-project'))
}

export const isMapsConfigured = (): boolean =>
  !!(import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined)

export const isStripeConfigured = (): boolean =>
  !!(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined)

export const isDocusealConfigured = (): boolean =>
  !!(import.meta.env.VITE_DOCUSEAL_TEMPLATE_ID as string | undefined)
