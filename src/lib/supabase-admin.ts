import { createClient } from '@supabase/supabase-js'

// Server-side admin client – using service role key for admin operations
// This file should ONLY be imported in API routes (server-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Supabase URL or SERVICE_ROLE_KEY missing in environment variables')
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
