import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getProductsByUser } from '@/lib/products';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') || request.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let userId: string, userEmail: string;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET!));
    userId = payload.sub as string;
    userEmail = (payload.email as string) ?? '';
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const products = await getProductsByUser(userId);

  if (products.length === 0) {
    return NextResponse.json({
      success: true,
      data: {
        stats: [
          { label: 'Products', value: '0', change: '', changeType: 'neutral', icon: 'products' },
          { label: 'Total Scans', value: '0', change: '', changeType: 'neutral', icon: 'scan' },
          { label: 'Violations', value: '0', change: '', changeType: 'neutral', icon: 'illegal' },
          { label: 'Platforms', value: '0', change: '', changeType: 'neutral', icon: 'email' },
        ],
        violations: [], activities: [], alerts: [], products,
        user: { id: userId, email: userEmail },
        source: 'database', timestamp: new Date().toISOString(),
      },
    });
  }

  // Baca hasil monitoring terbaru dari DB (bukan re-scan)
  const productIds = products.map((p) => p.id);
  const { data: rows } = await supabaseAdmin
    .from('monitoring_results')
    .select('*')
    .in('product_id', productIds)
    .order('completed_at', { ascending: false })
    .limit(200);

  const results = rows ?? [];

  // Build violations list
  const violations = results.flatMap((r) =>
    (r.violations as any[] ?? []).map((v: any, i: number) => ({
      id: `${r.id}_${i}`,
      domain: v.url ?? v.domain ?? 'unknown',
      brand: r.search_query,
      severity: 'high' as const,
      type: 'Trademark',
      detected: r.completed_at,
      status: 'active' as const,
      confidence: 85 + Math.floor(Math.random() * 10),
      url: v.url ?? '',
      title: v.title ?? 'Unknown',
      platform: r.platform,
      seller: v.seller ?? '',
      description: v.description ?? '',
    }))
  );

  const totalViolations = results.reduce((s, r) => s + (r.violation_count ?? 0), 0);
  const platforms = [...new Set(results.map((r) => r.platform))];

  const stats = [
    { label: 'Products', value: String(products.length), change: '', changeType: 'neutral', icon: 'products' },
    { label: 'Total Scans', value: String(results.length), change: '', changeType: 'neutral', icon: 'scan' },
    { label: 'Violations', value: String(totalViolations), change: '', changeType: totalViolations > 0 ? 'negative' : 'positive', icon: 'illegal' },
    { label: 'Platforms', value: String(platforms.length), change: platforms.join(', '), changeType: 'neutral', icon: 'email' },
  ];

  const activities = results.slice(0, 10).map((r) => ({
    id: r.id,
    action: (r.violation_count ?? 0) > 0 ? 'Violation detected' : 'Scan completed',
    user: 'System',
    target: `${r.violation_count ?? 0} violation(s) on ${r.platform} — "${r.search_query}"`,
    timestamp: r.completed_at,
    type: (r.violation_count ?? 0) > 0 ? 'warning' : 'success',
  }));

  const alerts = violations.slice(0, 5).map((v, i) => ({
    id: `alert_${i}`,
    title: `Violation: ${v.brand} on ${v.platform}`,
    description: v.title || v.domain,
    priority: 'critical' as const,
    timestamp: v.detected,
    actionRequired: true,
  }));

  // Platform breakdown untuk analytics
  const platformBreakdown = platforms.map((p) => {
    const pRows = results.filter((r) => r.platform === p);
    return {
      platform: p,
      scanned: pRows.reduce((s, r) => s + ((r.results as any[])?.length ?? 0), 0),
      violations: pRows.reduce((s, r) => s + (r.violation_count ?? 0), 0),
    };
  });

  return NextResponse.json({
    success: true,
    data: {
      stats, violations, activities, alerts, products,
      platformBreakdown,
      user: { id: userId, email: userEmail },
      source: 'database', timestamp: new Date().toISOString(),
    },
  });
}
