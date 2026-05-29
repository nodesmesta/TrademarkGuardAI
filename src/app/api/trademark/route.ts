import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json({ success: true, message: 'Trademark monitoring placeholder' });
}

export async function GET() {
  return NextResponse.json({
    name: 'TradeGuard AI Trademark Monitoring API',
    version: '2.0.0',
    status: 'placeholder'
  });
}
