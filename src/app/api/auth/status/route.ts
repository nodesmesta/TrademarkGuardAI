import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  if (!token) {
    return NextResponse.json({ success: true, authenticated: false, message: 'Not authenticated' });
  }
  return NextResponse.json({ success: true, authenticated: true, user: { id: 'placeholder', email: 'placeholder@example.com', name: 'Placeholder' } });
}
