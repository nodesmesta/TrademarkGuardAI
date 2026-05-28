import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { scrapeSync, triggerSearch, detectViolations } from '@/lib/brightdata';

const TrademarkMonitoringSchema = z.object({
  trademark: z.string().min(2),
  url: z.string().url().optional(),
  platform: z.string().optional().default('google_search'),
  keywords: z.array(z.string()).optional().default([]),
  mode: z.enum(['sync', 'async']).optional().default('sync'),
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const monitoringId = `mon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    const body = await request.json();
    const parsed = TrademarkMonitoringSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: parsed.error.flatten(), monitoringId },
        { status: 400 }
      );
    }

    const { trademark, platform, keywords, mode } = parsed.data;
    const queries = [trademark, ...keywords].slice(0, 3);
    const dataset = (platform as 'google_search' | 'amazon_search' | 'google_shopping') ?? 'google_search';

    if (mode === 'async') {
      // Trigger async scrape — return snapshot IDs for polling
      const snapshots = await Promise.all(
        queries.map(async (q) => ({
          query: q,
          snapshotId: await triggerSearch(q, dataset),
        }))
      );

      return NextResponse.json({
        success: true,
        trademark,
        monitoringId,
        mode: 'async',
        snapshots,
        pollUrl: '/api/brightdata/snapshot/{snapshotId}?trademark=' + encodeURIComponent(trademark),
        timestamp: new Date().toISOString(),
        metadata: { processingTime: Date.now() - startTime },
      });
    }

    // Sync mode — scrape and return results immediately
    const allResults = (
      await Promise.all(queries.map((q) => scrapeSync(q, dataset).catch(() => [])))
    ).flat();

    const violations = detectViolations(allResults, trademark);

    return NextResponse.json({
      success: true,
      trademark,
      monitoringId,
      mode: 'sync',
      results: allResults,
      violations,
      summary: {
        hasViolations: violations.length > 0,
        violationCount: violations.length,
        totalResults: allResults.length,
        recommendedAction: violations.length > 0 ? 'Manual review recommended' : 'No action required',
      },
      timestamp: new Date().toISOString(),
      metadata: { processingTime: Date.now() - startTime, dataset },
    });
  } catch (err: any) {
    console.error('[trademark]', err);
    return NextResponse.json(
      { success: false, error: err.message, monitoringId },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'TradeGuard AI Trademark Monitoring API',
    version: '2.0.0',
    status: 'live',
    provider: 'Brightdata Scrapers Library',
    datasets: ['google_search', 'amazon_search', 'google_shopping'],
    endpoints: {
      'POST /api/trademark': 'Monitor trademark (sync or async)',
      'POST /api/brightdata/monitor': 'Full multi-platform monitoring',
      'GET /api/brightdata/snapshot/[id]': 'Poll async snapshot result',
    },
    timestamp: new Date().toISOString(),
  });
}
