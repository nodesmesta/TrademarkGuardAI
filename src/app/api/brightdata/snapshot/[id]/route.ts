import { NextRequest, NextResponse } from 'next/server';
import { getSnapshot } from '@/lib/brightdata';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: snapshotId } = await params;

  if (!snapshotId) {
    return NextResponse.json({ error: 'Snapshot ID required' }, { status: 400 });
  }

  try {
    const results = await getSnapshot(snapshotId, { maxRetries: 3, intervalMs: 2000 });
    return NextResponse.json({ success: true, snapshot_id: snapshotId, count: results.length, results });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
