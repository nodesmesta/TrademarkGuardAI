import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/callback
 * 
 * DEPRECATED: No longer sets cookies. Authentication now uses localStorage only.
 * This endpoint exists for backward compatibility but does nothing.
 * 
 * Flow (new):
 * 1. Client receives { user, token } from /api/auth/verify-pin
 * 2. Client stores in localStorage
 * 3. Client includes token in Authorization header for API calls
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { access_token, user } = body;

    // Validate inputs
    if (!access_token || typeof access_token !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Access token is required' },
        { status: 400 }
      );
    }

    if (!user || typeof user !== 'object') {
      return NextResponse.json(
        { success: false, error: 'User data is required' },
        { status: 400 }
      );
    }

    // ✅ NO COOKIES: Just return success
    // Client should store token and user in localStorage
    console.log('[auth/callback] Cookie auth deprecated. Use localStorage instead.');

    return NextResponse.json({ 
      success: true, 
      message: 'Cookie auth deprecated. Store token in localStorage.' 
    });

  } catch (error) {
    console.error('[auth/callback] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// GET handler for backward compatibility (not used in PIN flow)
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { success: false, error: 'Use POST method with access_token and user data' },
    { status: 405 }
  );
}
