// Check if an email is already registered in Supabase Auth
// NOTE: We cannot directly query auth.users table via REST API (it's internal to Supabase)
// Instead, we rely on Supabase's built-in duplicate email handling during signup
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  if (!email) {
    return NextResponse.json({ success: false, error: 'Email parameter missing' }, { status: 400 });
  }

  // Supabase Auth already handles duplicate email checks internally
  // When signInWithOtp is called with an existing email, it will:
  // 1. Send OTP to the existing user (if they exist)
  // 2. NOT create a duplicate account
  // 3. Return success either way
  
  // For now, we return a placeholder response
  // In the future, you could implement email existence check via:
  // - Admin API (requires service_role key, not recommended for client-side)
  // - Custom user profile table (if you create one separately)
  
  console.log('[check-email] Email check skipped - Supabase handles duplicates internally');
  return NextResponse.json({ success: true, exists: false, note: 'Supabase handles duplicate detection' });
}
