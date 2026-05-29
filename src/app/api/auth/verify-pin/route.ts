import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('[verify-pin] received', data);
    const { email, pin } = data;
    if (!email || !pin) {
      return NextResponse.json({ success: false, error: 'Email and PIN required' }, { status: 400 });
    }
    // Verify OTP via Supabase
    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: pin,
      type: 'email',
    });
    if (verifyError) {
      const msg = verifyError.message.toLowerCase();
      if (msg.includes('invalid') || msg.includes('expired')) {
        return NextResponse.json({ success: false, error: 'Invalid or expired PIN' }, { status: 401 });
      }
      return NextResponse.json({ success: false, error: verifyError.message }, { status: 400 });
    }
    // Get session to obtain access token
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      return NextResponse.json({ success: false, error: 'Session creation failed' }, { status: 500 });
    }
    const user = sessionData.session.user;
    const token = sessionData.session.access_token;
    return NextResponse.json({ success: true, user, token });
  } catch (e) {
    console.error('[verify-pin] error:', e);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
