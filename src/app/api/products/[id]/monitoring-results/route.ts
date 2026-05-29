// src/app/api/products/[id]/monitoring-results/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * GET /api/products/:id/monitoring-results
 * Returns the stored Brightdata monitoring results for the given product.
 *
 * Authentication: Bearer JWT (same as other product routes).
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // ---- Auth ----
    const token = request.headers.get('Authorization')?.replace('Bearer ', '').trim();
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.sub as string;

    // ---- Load product & verify ownership ----
    const { id } = await params;
    const { data: product, error: prodErr } = await supabaseAdmin
      .from('products')
      .select('id, user_id')
      .eq('id', id)
      .single();
    if (prodErr || !product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    if (product.user_id !== userId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    // ---- Fetch monitoring results ----
    const { data: results, error: resErr } = await supabaseAdmin
      .from('monitoring_results')
      .select('platform, search_query, results, violations, created_at')
      .eq('product_id', id)
      .order('created_at', { ascending: false });
    if (resErr) {
      console.error('[monitoring-results] Supabase error:', resErr);
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ success: true, monitoringResults: results ?? [] });
  } catch (err: any) {
    console.error('[monitoring-results] Unexpected error:', err);
    return NextResponse.json({ success: false, error: err.message ?? 'Server error' }, { status: 500 });
  }
}
