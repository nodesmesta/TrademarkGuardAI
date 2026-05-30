import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserId } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId(request);
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  // Verify product belongs to user
  const { data: product } = await supabaseAdmin
    .from('products')
    .select('id')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });

  const { data, error } = await supabaseAdmin
    .from('monitoring_results')
    .select('*')
    .eq('product_id', id)
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, monitoringResults: data ?? [] });
}
