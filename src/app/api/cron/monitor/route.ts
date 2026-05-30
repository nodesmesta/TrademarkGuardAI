import { NextRequest, NextResponse } from 'next/server';
import * as tw from '@/lib/triggerware';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Poll all active Triggerware triggers for new trademark violations
    const triggers = await tw.listTriggers();
    const results: { trigger: string; added: unknown[]; deleted: unknown[] }[] = [];

    if (Array.isArray(triggers)) {
      for (const trigger of triggers) {
        if (trigger.status !== 'enabled') continue;
        const delta = await tw.pollTrigger(trigger.name);
        if (delta?.added?.length || delta?.deleted?.length) {
          results.push({ trigger: trigger.name, added: delta.added || [], deleted: delta.deleted || [] });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Polled ${Array.isArray(triggers) ? triggers.length : 0} triggers`,
      violations: results,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
