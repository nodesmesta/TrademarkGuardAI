import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return NextResponse.json({ success: true, authenticated: false, message: 'Not authenticated' });
  }

  try {
    const jwtSecret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);
    const { payload } = await jwtVerify(token, jwtSecret);

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: payload.sub,
        email: payload.email as string ?? '',
        name: payload.name as string ?? '',
      },
    });
  } catch {
    return NextResponse.json({ success: true, authenticated: false, message: 'Invalid or expired token' });
  }
}
