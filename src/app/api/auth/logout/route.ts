import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  // Extract token from Authorization header
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '').trim();

  if (token) {
    // Get the user from the token, then sign out their session via admin
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (!error && user) {
      // Sign out all sessions for this user
      await supabaseAdmin.auth.admin.signOut(token);
    }
  }

  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

  // Clear any auth cookies
  response.cookies.set({ name: 'user', value: '', expires: new Date(0), path: '/' });
  response.cookies.set({ name: 'token', value: '', expires: new Date(0), path: '/' });

  return response;
}
