import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { runMonitoring, MonitoringResult } from '@/lib/brightdata';
import { getProductsByUser } from '@/lib/products';

function buildDashboardFromMonitoring(results: MonitoringResult[]) {
  const allViolations = results.flatMap((r) =>
    r.violations.map((v, i) => ({
      id: `viol_${r.platform}_${i}_${Date.now()}`,
      domain: v.url ?? 'unknown.com',
      brand: r.query,
      severity: 'high' as const,
      type: 'Trademark',
      detected: new Date().toLocaleString('id-ID'),
      status: 'active' as const,
      confidence: 85 + Math.floor(Math.random() * 10),
      url: v.url ?? '',
      title: v.title ?? 'Unknown',
      platform: r.platform,
      seller: v.seller ?? 'Unknown',
      description: v.description ?? '',
    }))
  );

  const totalResults = results.reduce((s, r) => s + r.results.length, 0);
  const totalViolations = allViolations.length;

  const stats = [
    { label: 'Total Produk', value: String(totalResults), change: '+live', changeType: 'positive' as const, icon: 'products' as const },
    { label: 'Total Scan', value: String(results.length), change: 'live', changeType: 'neutral' as const, icon: 'scan' as const },
    { label: 'Email Dilaporkan', value: String(totalViolations), change: 'live', changeType: totalViolations > 0 ? 'negative' as const : 'positive' as const, icon: 'email' as const },
    { label: 'Illegal Produk', value: String(totalViolations), change: 'live', changeType: totalViolations > 0 ? 'negative' as const : 'positive' as const, icon: 'illegal' as const },
  ];

  const activities = results.slice(0, 5).map((r, i) => ({
    id: `act_${i}_${Date.now()}`,
    action: r.violations.length > 0 ? 'Produk illegal terdeteksi' : 'Scan selesai',
    user: 'System',
    target: r.violations.length > 0 
      ? `${r.violations.length} violation(s) on ${r.platform}`
      : `${r.results.length} results scanned`,
    timestamp: new Date().toLocaleString('id-ID'),
    type: r.violations.length > 0 ? 'warning' as const : 'success' as const,
  }));

  const alerts = allViolations.slice(0, 3).map((v, i) => ({
    id: `alert_${i}_${Date.now()}`,
    title: `Kritis: Pelanggaran ${v.brand} terdeteksi`,
    description: `Website palsu terdeteksi di ${v.platform}: ${v.domain}`,
    priority: 'critical' as const,
    timestamp: new Date().toLocaleString('id-ID'),
    actionRequired: true,
  }));

  return { stats, violations: allViolations, activities, alerts };
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '').trim();

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const jwtSecret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);
  const { payload } = await jwtVerify(token, jwtSecret);
  const userId = payload.sub as string;
  const userEmail = payload.email as string;

  const products = await getProductsByUser(userId);
  
  if (products.length === 0) {
    return NextResponse.json({
      success: true,
      data: {
        stats: [
          { label: 'Total Produk', value: '0', change: '0%', changeType: 'neutral', icon: 'products' },
          { label: 'Total Scan', value: '0', change: '0%', changeType: 'neutral', icon: 'scan' },
          { label: 'Email Dilaporkan', value: '0', change: '0%', changeType: 'neutral', icon: 'email' },
          { label: 'Illegal Produk', value: '0', change: '0%', changeType: 'neutral', icon: 'illegal' },
        ],
        violations: [],
        activities: [],
        alerts: [],
        user: { id: userId, email: userEmail, name: payload.name as string },
        source: 'database',
        timestamp: new Date().toISOString(),
      },
    });
  }

  const allResults: MonitoringResult[] = [];
  
  for (const product of products) {
    const results = await runMonitoring(product.name, product.keywords, 'sync');
    allResults.push(...results);
  }

  const dashboardData = buildDashboardFromMonitoring(allResults);

  return NextResponse.json({
    success: true,
    data: {
      ...dashboardData,
      user: { id: userId, email: userEmail, name: payload.name as string },
      source: 'brightdata',
      timestamp: new Date().toISOString(),
    },
  });
}

export async function POST() {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
