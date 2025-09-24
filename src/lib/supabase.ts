
import { createClient } from '@supabase/supabase-js'

// Normalize and validate environment variables lazily to avoid build-time crashes
const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Ensure URL has protocol to avoid client internal errors
const supabaseUrl = rawUrl
  ? (rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`)
  : undefined

if (!supabaseUrl || !supabaseAnonKey) {
  // Do not throw during build; runtime calls will fail clearly if not configured
  console.warn('[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Client calls will fail until configured.')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (undefined as unknown as ReturnType<typeof createClient>)
