import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserId } from '@/lib/auth';
import { getAllActiveProducts, getProductsByUser } from '@/lib/products';
import { monitorProduct } from '@/lib/monitoring-job';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { product_id, scope } = body as { product_id?: string; scope?: 'all' | 'user' };

  // If scope=all, require CRON_SECRET
  if (scope === 'all') {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const products = await getAllActiveProducts();
    const results: { name: string; violations: number; scanned: number; error?: string }[] = [];

    for (const product of products) {
      try {
        const r = await monitorProduct(product, 'cron');
        results.push({ name: product.name, violations: r.violations, scanned: r.scanned });
      } catch (e) {
        results.push({ name: product.name, violations: 0, scanned: 0, error: (e as Error).message });
      }
    }

    return NextResponse.json({
      success: true,
      processed: products.length,
      totalViolations: results.reduce((s, r) => s + r.violations, 0),
      results,
    });
  }

  // User-scoped: scan specific product or all user's products
  const userId = await getAuthUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const products = product_id
    ? (await getProductsByUser(userId)).filter(p => p.id === product_id)
    : await getProductsByUser(userId);

  if (!products.length) {
    return NextResponse.json({ error: 'No products found' }, { status: 404 });
  }

  const results: { id: string; name: string; violations: number; scanned: number; platforms: string[] }[] = [];

  for (const product of products) {
    try {
      const r = await monitorProduct(product, 'manual');
      const platforms = [...new Set(r.results.map(res => res.platform))];
      results.push({ id: product.id, name: product.name, violations: r.violations, scanned: r.scanned, platforms });
    } catch (e) {
      console.error(`[brightdata/monitor] scan failed for ${product.name}:`, e);
      results.push({ id: product.id, name: product.name, violations: 0, scanned: 0, platforms: [] });
    }
  }

  return NextResponse.json({
    success: true,
    processed: results.length,
    totalViolations: results.reduce((s, r) => s + r.violations, 0),
    results,
  });
}
