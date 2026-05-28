import { type NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PROTECTED = ['/dashboard'];
const AUTH_ONLY = ['/signin', '/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthOnly = AUTH_ONLY.some((p) => pathname.startsWith(p));

  if (!isProtected && !isAuthOnly) return NextResponse.next();

  // Read token from Authorization header (set by client on navigation)
  // or from cookie as fallback
  const token =
    request.cookies.get('token')?.value ??
    request.headers.get('Authorization')?.replace('Bearer ', '');

  let authenticated = false;
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);
      await jwtVerify(token, secret);
      authenticated = true;
    } catch {
      authenticated = false;
    }
  }

  if (isProtected && !authenticated) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  if (isAuthOnly && authenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/signin', '/signup'],
};
