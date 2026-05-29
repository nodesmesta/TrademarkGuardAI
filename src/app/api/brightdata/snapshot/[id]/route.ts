import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    return NextResponse.json({ success: true, message: 'Brightdata snapshot placeholder' });
}
