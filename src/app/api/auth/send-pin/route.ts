import { NextRequest, NextResponse } from 'next/server';
import { getEmailService } from '@/features/auth/lib/email-service';
import { pinStore } from '@/lib/pin-store';
import { supabaseAdmin } from '@/lib/supabase-admin';

function generatePin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    // Check if email is registered in Supabase
    const normalizedEmail = email.toLowerCase().trim();
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    if (userError) {
      console.error('[send-pin] Failed to list users:', userError);
      return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
    const existingUser = userData.users.find(
      (u) => u.email?.toLowerCase() === normalizedEmail
    );
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email not registered. Please sign up first.' },
        { status: 404 }
      );
    }

    const pin = generatePin();
    await pinStore.set(normalizedEmail, pin);
    console.log('[send-pin] stored PIN for', normalizedEmail);

    const emailService = getEmailService();
    await emailService.sendPinEmail(normalizedEmail, pin);

    return NextResponse.json({ success: true, message: 'PIN sent to your email' });
  } catch (e) {
    console.error('[send-pin] error:', e);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
