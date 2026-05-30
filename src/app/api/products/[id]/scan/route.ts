import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserId } from '@/lib/auth';
import { monitorProduct } from '@/lib/monitoring-job';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthUserId(request);
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { id: productId } = await params;

  const { data: product, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', productId)
    .eq('user_id', userId)
    .single();

  if (error || !product) {
    return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
  }

  try {
    const { violations, scanned, results } = await monitorProduct(product, 'manual');
    return NextResponse.json({
      success: true,
      scanned,
      violations,
      platforms: [...new Set(results.map((r) => r.platform))],
    });
  } catch (e) {
    console.error('[scan] monitorProduct error:', e);
    return NextResponse.json({ success: false, error: 'Scan failed' }, { status: 500 });
  }
}
