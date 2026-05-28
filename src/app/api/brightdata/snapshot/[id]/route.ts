import { NextRequest, NextResponse } from 'next/server';
import { getSnapshot, detectViolations } from '@/lib/brightdata';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const trademark = request.nextUrl.searchParams.get('trademark') ?? '';

    const results = await getSnapshot(id);

    if (results.length === 0) {
      return NextResponse.json({ success: true, status: 'processing', snapshotId: id });
    }

    const violations = trademark ? detectViolations(results, trademark) : [];

    return NextResponse.json({
      success: true,
      status: 'ready',
      snapshotId: id,
      results,
      violations,
      trademark,
    });
  } catch (err: any) {
    console.error('[brightdata/snapshot]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
