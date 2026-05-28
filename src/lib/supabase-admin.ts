import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy singleton — only instantiated at runtime, not at build time
let _client: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase URL or SERVICE_ROLE_KEY missing')
  _client = createClient(url, key)
  return _client
}

// Proxy so existing imports of `supabaseAdmin.from(...)` still work
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseAdmin() as any)[prop]
  },
})
