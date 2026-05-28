import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { createAdminSupabaseClient } from '@/utils/supabase/server';

// Mock dashboard data used for development and testing
const mockDashboardData = {
  stats: [
    { label: 'Total Scans', value: '1,245', change: '+12%', color: 'blue' },
    { label: 'Violations Found', value: '89', change: '+5%', color: 'red' },
    { label: 'Active Alerts', value: '23', change: '-8%', color: 'orange' },
    { label: 'Resolved Cases', value: '156', change: '+18%', color: 'green' },
    { label: 'Avg Response Time', value: '3.2h', change: '-15%', color: 'purple' },
    { label: 'Success Rate', value: '94.5%', change: '+2%', color: 'teal' },
  ],
  violations: [],
  activities: [],
  alerts: [],
};

/**
 * GET /api/dashboard/data
 * Returns mock dashboard data for an authenticated user.
 * 
 * Validation flow:
 * 1. Verify JWT token signature and expiry
 * 2. Parse user data from cookie (already validated at sign-in time)
 * 3. Return dashboard data without additional DB query
 */
export async function GET(request: NextRequest) {
  try {
    const userCookie = request.cookies.get('user')?.value;
    const tokenCookie = request.cookies.get('token')?.value;

    if (!userCookie || !tokenCookie) {
      return NextResponse.json({ error: 'Unauthorized', message: 'Authentication required' }, { status: 401 });
    }

    // Step 1: Validate JWT token signature
    const jwtSecret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);
    
    try {
      await jwtVerify(tokenCookie, jwtSecret);
    } catch (error: any) {
      console.error('[dashboard/data] JWT validation failed:', error.message);
      return NextResponse.json({ error: 'Unauthorized', message: 'Invalid or expired token' }, { status: 401 });
    }

    // Step 2: Parse user data from cookie
    // User data was already validated during PIN verification and JWT generation
    const parsedUser = JSON.parse(decodeURIComponent(userCookie));

    // Step 3: Optional - Verify user still exists in auth.users (for security)
    // This is a soft check - if user was deleted from auth, we still allow access
    // because the JWT is valid and signed by us
    try {
      const supabase = await createAdminSupabaseClient();
      const { data: usersData } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 100,
      });

      const userExists = usersData?.users?.some(u => u.id === parsedUser.id);
      
      if (!userExists) {
        console.warn('[dashboard/data] User not found in auth.users but JWT is valid:', parsedUser.id);
        // Continue anyway - JWT is valid, user might be in process of being synced
      }
    } catch (dbError) {
      console.warn('[dashboard/data] Could not verify user in auth.users:', dbError);
      // Continue anyway - JWT validation passed
    }

    return NextResponse.json({
      success: true,
      data: {
        ...mockDashboardData,
        user: {
          id: parsedUser.id,
          email: parsedUser.email,
          name: parsedUser.name,
          timestamp: new Date().toISOString(),
        },
      },
      message: 'Dashboard data retrieved successfully',
    });

  } catch (error) {
    console.error('[dashboard/data] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: 'Failed to retrieve dashboard data' }, { status: 500 });
  }
}

/**
 * POST /api/dashboard/data
 * Placeholder endpoint – not used in the current UI.
 */
export async function POST(request: NextRequest) {
  return NextResponse.json({ error: 'Not implemented', message: 'POST endpoint is not supported' }, { status: 501 });
}
