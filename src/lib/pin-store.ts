import { supabaseAdmin } from '@/lib/supabase-admin';

const fallbackMap = new Map<string, string>();

class PinStore {
  private async storeInUserMetadata(email: string, pin: string): Promise<void> {
    try {
      const { data: users } = await supabaseAdmin.auth.admin.listUsers();
      const user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
      if (!user) return;
      
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        user_metadata: { ...user.user_metadata, auth_pin: pin, pin_generated_at: new Date().toISOString() }
      });
      console.log('[pinStore] stored PIN in user metadata:', email);
    } catch (e) {
      console.warn('[pinStore] failed to store in user metadata:', e);
    }
  }

  private async getFromUserMetadata(email: string): Promise<string | null> {
    try {
      const { data: users } = await supabaseAdmin.auth.admin.listUsers();
      const user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
      if (!user || !user.user_metadata?.auth_pin) return null;
      
      const pin = user.user_metadata.auth_pin as string;
      console.log('[pinStore] get from user metadata:', email, pin);
      return pin;
    } catch (e) {
      console.warn('[pinStore] failed to get from user metadata:', e);
      return null;
    }
  }

  private async clearUserMetadata(email: string): Promise<void> {
    try {
      const { data: users } = await supabaseAdmin.auth.admin.listUsers();
      const user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
      if (!user) return;
      
      const metadata = { ...user.user_metadata };
      delete metadata.auth_pin;
      delete metadata.pin_generated_at;
      
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        user_metadata: metadata
      });
    } catch (e) {
      console.warn('[pinStore] failed to clear user metadata:', e);
    }
  }

  async set(email: string, pin: string) {
    fallbackMap.set(email, pin);
    console.log('[pinStore] fallbackMap set:', email, pin);
    
    try {
      const { error } = await supabaseAdmin.from('auth_pins').upsert({ email, pin });
      if (error) {
        console.warn('[pinStore] auth_pins upsert failed:', error.message);
        await this.storeInUserMetadata(email, pin);
      } else {
        console.log('[pinStore] auth_pins upsert succeeded');
      }
    } catch (e) {
      console.warn('[pinStore] Supabase error:', e);
      await this.storeInUserMetadata(email, pin);
    }
  }

  async get(email: string): Promise<string | null> {
    if (fallbackMap.has(email)) {
      const pin = fallbackMap.get(email);
      console.log('[pinStore] get from fallbackMap:', email, pin);
      return pin ?? null;
    }
    
    try {
      const { data, error } = await supabaseAdmin
        .from('auth_pins')
        .select('pin')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (error) {
        console.warn('[pinStore] auth_pins query error:', error.message);
        return await this.getFromUserMetadata(email);
      }
      if (!data) {
        return await this.getFromUserMetadata(email);
      }
      console.log('[pinStore] get from auth_pins:', email, data.pin);
      return data.pin as string;
    } catch (e) {
      console.warn('[pinStore] Supabase exception:', e);
      return await this.getFromUserMetadata(email);
    }
  }

  async delete(email: string) {
    await supabaseAdmin.from('auth_pins').delete().eq('email', email);
    await this.clearUserMetadata(email);
  }
}

export const pinStore = new PinStore();
