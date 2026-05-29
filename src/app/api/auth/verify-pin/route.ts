import { NextRequest, NextResponse } from 'next/server';
import { pinStore } from '../send-pin/route';

export async function POST(request: NextRequest) {
  try {
    const { email, pin } = await request.json();
    if (!email || !pin) {
      return NextResponse.json({ success: false, error: 'Email and PIN required' }, { status: 400 });
    }
    const storedPin = pinStore.get(email);
    if (!storedPin) {
      return NextResponse.json({ success: false, error: 'No PIN found for this email' }, { status: 400 });
    }
    if (storedPin !== pin) {
      return NextResponse.json({ success: false, error: 'Invalid PIN' }, { status: 401 });
    }
    // PIN is valid, remove it
    pinStore.delete(email);
    // Generate a simple token (not secure, placeholder)
    const token = Math.random().toString(36).substring(2);
    const user = { id: email, email, name: '' };
    return NextResponse.json({ success: true, user, token });
  } catch (e) {
    console.error('[verify-pin] error:', e);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
