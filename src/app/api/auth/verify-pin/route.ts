import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { pinStore } from '@/lib/pin-store';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const { email, pin } = await request.json();
    if (!email || !pin) {
      return NextResponse.json({ success: false, error: 'Email and PIN required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const storedPin = await pinStore.get(normalizedEmail);
    if (!storedPin) {
      return NextResponse.json({ success: false, error: 'No PIN found for this email' }, { status: 400 });
    }
    if (storedPin !== pin) {
      return NextResponse.json({ success: false, error: 'Invalid PIN' }, { status: 401 });
    }

    // PIN is valid — remove it
    pinStore.delete(normalizedEmail);

    // Fetch real user from Supabase
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers({ filter: `email.eq.${normalizedEmail}` } as any);
    const supabaseUser = userData?.users?.[0];
    if (userError || !supabaseUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const userId = supabaseUser.id;
    const userName = supabaseUser.user_metadata?.full_name || normalizedEmail.split('@')[0];

    // Sign JWT with real user ID
    const jwtSecret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET || 'dev-secret');
    const token = await new SignJWT({ email: normalizedEmail })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .setSubject(userId)
      .sign(jwtSecret);

    const user = { id: userId, email: normalizedEmail, name: userName };

    return NextResponse.json({ success: true, user, token }, {
      headers: {
        'Set-Cookie': `token=${token}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax; HttpOnly`,
      },
    });
  } catch (e) {
    console.error('[verify-pin] error:', e);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
