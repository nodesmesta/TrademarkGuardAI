import { NextRequest, NextResponse } from 'next/server';
import { runAllMonitoring } from '@/lib/monitoring-job';

export async function GET(request: NextRequest) {
  // Vercel Cron sends: Authorization: Bearer <CRON_SECRET>
  // Manual calls can use: x-cron-secret header or ?secret= query param
  const authHeader = request.headers.get('Authorization');
  const bearerSecret = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const secret = bearerSecret
    ?? request.headers.get('x-cron-secret')
    ?? request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const start = Date.now();
  try {
    const summary = await runAllMonitoring();
    return NextResponse.json({ success: true, ...summary, durationMs: Date.now() - start });
  } catch (err: any) {
    console.error('[cron/monitor]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
