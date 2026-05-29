import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { pinStore } from '@/lib/pin-store';

export async function POST(request: NextRequest) {
  try {
    const { email, pin } = await request.json();
    if (!email || !pin) {
      return NextResponse.json({ success: false, error: 'Email and PIN required' }, { status: 400 });
    }
    const storedPin = await pinStore.get(email);
    if (!storedPin) {
      return NextResponse.json({ success: false, error: 'No PIN found for this email' }, { status: 400 });
    }
    if (storedPin !== pin) {
      return NextResponse.json({ success: false, error: 'Invalid PIN' }, { status: 401 });
    }
    // PIN is valid, remove it
    pinStore.delete(email);
    // Generate a signed JWT (placeholder secret for dev)
    const jwtSecret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET || 'dev-secret');
    const { randomUUID } = await import('crypto');
      const userId = randomUUID();
      const token = await new SignJWT({ email })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .setSubject(userId)
        .sign(jwtSecret);
    const user = { id: email, email, name: '' };
    return NextResponse.json({ success: true, user, token });
  } catch (e) {
    console.error('[verify-pin] error:', e);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
