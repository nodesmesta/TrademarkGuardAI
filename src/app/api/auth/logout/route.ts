import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '').trim();

  if (token) {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (!error && user) {
      await supabaseAdmin.auth.admin.signOut(token);
    }
  }

  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

  response.cookies.set({ name: 'user', value: '', expires: new Date(0), path: '/' });
  response.cookies.set({ name: 'token', value: '', expires: new Date(0), path: '/' });

  return response;
}
