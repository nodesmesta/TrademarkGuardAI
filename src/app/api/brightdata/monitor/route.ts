import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { triggerSearch, runMonitoring } from '@/lib/brightdata';

const MonitorSchema = z.object({
  trademark: z.string().min(2),
  keywords: z.array(z.string()).optional().default([]),
  mode: z.enum(['sync', 'async']).optional().default('async'),
  datasets: z.array(z.enum(['google_search', 'amazon_search', 'google_shopping'])).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = MonitorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }

    const { trademark, keywords, mode } = parsed.data;

    const results = await runMonitoring(trademark, keywords, mode);

    return NextResponse.json({
      success: true,
      trademark,
      mode,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[brightdata/monitor]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
