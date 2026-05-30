import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { supabaseAdmin } from '@/lib/supabase-admin';

async function getUserId(req: NextRequest): Promise<string | null> {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '') || req.cookies.get('token')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET!));
    return payload.sub as string;
  } catch { return null; }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId(request);
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
