import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

/**
 * GET /api/auth/status
 * 
 * Checks if the user is authenticated by validating JWT token from Authorization header.
 * NO COOKIES: Token must be passed in Authorization header or from localStorage.
 * 
 * Returns user data if authenticated, not authenticated otherwise.
 */
export async function GET(request: NextRequest) {
  try {
    // ✅ NO COOKIES: Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (!token) {
      return NextResponse.json({
        success: true,
        authenticated: false,
        message: 'Not authenticated'
      });
    }

    // Validate JWT token
    const jwtSecret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);
    
    try {
      const { payload } = await jwtVerify(token, jwtSecret);

      // Extract user data from token
      const email = payload.email as string || '';
      
      return NextResponse.json({
        success: true,
        authenticated: true,
        user: {
          id: payload.sub,
          email: email,
          name: payload.name || email.split('@')[0] || '',
          role: payload.role || 'user',
          verified: payload.verified || false,
        },
        message: 'User is authenticated'
      });

    } catch (error: any) {
      // Invalid token
      console.error('[auth/status] Token validation failed:', error.message);
      
      return NextResponse.json({
        success: true,
        authenticated: false,
        message: 'Invalid or expired token'
      });
    }

  } catch (error) {
    console.error('[auth/status] Unexpected error:', error);
    return NextResponse.json({
      success: false,
      authenticated: false,
      error: 'Failed to verify authentication'
    });
  }
}
