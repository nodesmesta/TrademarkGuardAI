import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: snapshotId } = await params;
  if (!snapshotId) return NextResponse.json({ error: 'Snapshot ID required' }, { status: 400 });

  // Fetch directly from BrightData API
  const res = await fetch(`https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}?format=json`, {
    headers: { Authorization: `Bearer ${process.env.BRIGHTDATA_API_KEY}` },
  });

  if (res.status === 202) return NextResponse.json({ success: false, status: 'processing' }, { status: 202 });
  if (!res.ok) return NextResponse.json({ error: 'Snapshot not found' }, { status: 404 });

  const results = await res.json();
  return NextResponse.json({ success: true, snapshot_id: snapshotId, count: results.length, results });
}
