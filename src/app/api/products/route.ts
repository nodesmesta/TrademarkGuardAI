import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ success: true, products: [] });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ success: true, product: {} }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ success: true });
}
