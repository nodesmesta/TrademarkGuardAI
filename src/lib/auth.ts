import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function getAuthUserId(req: NextRequest): Promise<string | null> {
  const header = req.headers.get('Authorization')?.replace('Bearer ', '');
  const cookie = req.cookies.get('token')?.value;
  const token = (header && header !== 'null' && header !== 'undefined' && header !== '') ? header : cookie;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET!));
    return payload.sub as string;
  } catch { return null; }
}
