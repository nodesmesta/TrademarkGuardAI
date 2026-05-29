import { supabase } from '@/lib/supabase-client';

const fallbackMap = new Map<string, string>();

export const pinStore = {
  async set(email: string, pin: string) {
    // Upsert the PIN for the email and cache locally
    try {
      await supabase.from('auth_pins').upsert({ email, pin });
    } catch (e) {
      console.error('[pinStore] supabase upsert error:', e);
    }
    // Always cache in memory so verification works even if DB write fails
    fallbackMap.set(email, pin);
  },
  async get(email: string): Promise<string | null> {
    // First try the in‑memory cache
    if (fallbackMap.has(email)) {
      return fallbackMap.get(email) ?? null;
    }
    try {
      const { data, error } = await supabase
        .from('auth_pins')
        .select('pin')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (error || !data) {
        // fallback to in‑memory store (already checked)
        return null;
      }
      return data.pin as string;
    } catch (e) {
      return null;
    }
  },
  async delete(email: string) {
    await supabase.from('auth_pins').delete().eq('email', email);
  },
};
