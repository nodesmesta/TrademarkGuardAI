import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { runMonitoring, MonitoringResult } from '@/lib/brightdata';

const fallbackStats = [
  { label: 'Total Scans', value: '0', change: '0%', changeType: 'neutral', icon: 'scan' },
  { label: 'Violations Found', value: '0', change: '0%', changeType: 'neutral', icon: 'alert' },
  { label: 'Active Alerts', value: '0', change: '0%', changeType: 'neutral', icon: 'bell' },
  { label: 'Resolved Cases', value: '0', change: '0%', changeType: 'neutral', icon: 'check' },
];

function buildDashboardFromMonitoring(results: MonitoringResult[]) {
  const allViolations = results.flatMap((r) =>
    r.violations.map((v, i) => ({
      id: `viol_${r.platform}_${i}`,
      trademark: r.query,
      platform: r.platform,
      url: v.url ?? '',
      title: v.title ?? 'Unknown',
      type: 'Potential Violation',
      confidence: 75,
      status: 'pending',
      detectedAt: new Date().toISOString(),
    }))
  );

  const totalResults = results.reduce((s, r) => s + r.results.length, 0);
  const totalViolations = allViolations.length;

  const stats = [
    { label: 'Total Scans', value: String(totalResults), change: '+live', changeType: 'positive', icon: 'scan' },
    { label: 'Violations Found', value: String(totalViolations), change: 'live', changeType: totalViolations > 0 ? 'negative' : 'positive', icon: 'alert' },
    { label: 'Platforms Scanned', value: String(new Set(results.map((r) => r.platform)).size), change: 'live', changeType: 'neutral', icon: 'globe' },
    { label: 'Queries Run', value: String(results.length), change: 'live', changeType: 'neutral', icon: 'search' },
  ];

  const activities = results.slice(0, 5).map((r, i) => ({
    id: `act_${i}`,
    type: r.violations.length > 0 ? 'violation_detected' : 'scan_completed',
    message: r.violations.length > 0
      ? `${r.violations.length} violation(s) found for "${r.query}" on ${r.platform}`
      : `Scan completed for "${r.query}" on ${r.platform} — no violations`,
    timestamp: new Date().toISOString(),
  }));

  const alerts = allViolations.slice(0, 3).map((v) => ({
    id: v.id,
    title: v.title,
    platform: v.platform,
    severity: 'high',
    message: `Potential trademark violation detected on ${v.platform}`,
    timestamp: new Date().toISOString(),
  }));

  return { stats, violations: allViolations, activities, alerts };
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '').trim();

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let parsedUser: { id: string; email: string; name: string };
    try {
      const jwtSecret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);
      const { payload } = await jwtVerify(token, jwtSecret);
      parsedUser = {
        id: payload.sub as string,
        email: (payload.email as string) ?? '',
        name: (payload.name as string) ?? '',
      };
    } catch {
      return NextResponse.json({ error: 'Unauthorized', message: 'Invalid or expired token' }, { status: 401 });
    }

    // Run live Brightdata monitoring for a default trademark query
    // In production, this would use the user's registered trademarks from DB
    const trademark = request.nextUrl.searchParams.get('trademark') ?? parsedUser.name ?? 'brand';

    let dashboardData;
    try {
      const monitoringResults = await runMonitoring(trademark, [], 'sync');
      dashboardData = buildDashboardFromMonitoring(monitoringResults);
    } catch (err) {
      console.warn('[dashboard/data] Brightdata unavailable, using fallback:', err);
      dashboardData = { stats: fallbackStats, violations: [], activities: [], alerts: [] };
    }

    return NextResponse.json({
      success: true,
      data: {
        ...dashboardData,
        user: { id: parsedUser.id, email: parsedUser.email, name: parsedUser.name },
        source: 'brightdata',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[dashboard/data]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
