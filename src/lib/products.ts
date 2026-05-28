import 'server-only';
import { supabaseAdmin } from './supabase-admin';

export interface Product {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  keywords: string[];
  platforms: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getProductsByUser(userId: string): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createProduct(
  userId: string,
  payload: { name: string; description?: string; keywords?: string[]; platforms?: string[] }
): Promise<Product> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert({ user_id: userId, ...payload })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(productId: string, userId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', productId)
    .eq('user_id', userId);
  if (error) throw error;
}

export async function getAllActiveProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('active', true);
  if (error) throw error;
  return data ?? [];
}

export async function saveMonitoringResult(result: {
  product_id: string;
  user_id: string;
  platform: string;
  search_query: string;
  results: unknown[];
  violations: unknown[];
  violation_count: number;
  triggered_by?: string;
  snapshot_id?: string;
  status?: string;
}): Promise<void> {
  const { error } = await supabaseAdmin.from('monitoring_results').insert({
    ...result,
    status: result.status ?? 'completed',
    completed_at: new Date().toISOString(),
  });
  if (error) throw error;
}
