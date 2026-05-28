import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

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
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '').trim();

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized', message: 'Authentication required' }, { status: 401 });
    }

    let parsedUser: { id: string; email: string; name: string };
    try {
      const jwtSecret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);
      const { payload } = await jwtVerify(token, jwtSecret);
      parsedUser = {
        id: payload.sub as string,
        email: payload.email as string ?? '',
        name: payload.name as string ?? '',
      };
    } catch {
      return NextResponse.json({ error: 'Unauthorized', message: 'Invalid or expired token' }, { status: 401 });
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
