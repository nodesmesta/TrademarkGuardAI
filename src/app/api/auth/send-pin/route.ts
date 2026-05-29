import { NextRequest, NextResponse } from 'next/server';
import { getEmailService } from '@/features/auth/lib/email-service';
import { pinStore } from '@/lib/pin-store';

function generatePin(): string {
  // 6-digit numeric PIN
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }
    const pin = generatePin();
    pinStore.set(email, pin);
    console.log('[send-pin] stored PIN for', email, pin);
    const emailService = getEmailService();
    await emailService.sendPinEmail(email, pin);
    // Return pin in response for debugging (remove in prod)
    return NextResponse.json({ success: true, message: 'PIN sent', pin });
  } catch (e) {
    console.error('[send-pin] error:', e);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
