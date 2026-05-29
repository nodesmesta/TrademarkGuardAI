import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
  const token =
    request.cookies.get('token')?.value ??
    request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const userId = payload.sub as string;
    const email = payload.email as string;

    // Fetch real user from Supabase
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
    const supabaseUser = userData?.user;

    const user = {
      id: userId,
      email,
      name: supabaseUser?.user_metadata?.full_name || email.split('@')[0],
    };

    return NextResponse.json({ authenticated: true, user });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
