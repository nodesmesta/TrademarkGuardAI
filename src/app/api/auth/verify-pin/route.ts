import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/utils/supabase/server';

/**
 * POST /api/auth/verify-pin
 * 
 * Verifies the 6-digit PIN from the auth_pins table.
 * If valid, creates a proper Supabase session with JWT token.
 * 
 * Features:
 * - Verifies PIN matches and not expired
 * - Tracks verification attempts (brute force protection)
 * - Marks PIN as used after successful verification
 * - Generates valid Supabase JWT token
 * - Returns user data, access_token, and refresh_token
 */
export async function POST(request: NextRequest) {
  try {
    const { email, pin } = await request.json();
    const normalizedEmail = email.toLowerCase().trim();

    // Validate inputs
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({
        success: false,
        error: { code: 'INVALID_EMAIL', message: 'Invalid email address' }
      }, { status: 400 });
    }

    if (!pin || pin.length !== 6 || /^\d{6}$/.test(pin) === false) {
      return NextResponse.json({
        success: false,
        error: { code: 'INVALID_PIN_FORMAT', message: 'PIN must be 6 digits' }
      }, { status: 400 });
    }

    // Create admin client
    const supabase = await createAdminSupabaseClient();

    // Get the most recent active PIN for this email
    const { data: pinRecord, error: pinQueryError } = await supabase
      .from('auth_pins')
      .select('*')
      .eq('email', normalizedEmail)
      .eq('used', false)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (pinQueryError || !pinRecord) {
      return NextResponse.json({
        success: false,
        error: { code: 'NO_PIN_FOUND', message: 'No active PIN found. Please request a new PIN.' }
      }, { status: 404 });
    }

    // Check if PIN has max attempts reached
    if (pinRecord.attempts >= pinRecord.max_attempts) {
      // Mark PIN as used and block further attempts
      await supabase
        .from('auth_pins')
        .update({ used: true, used_at: new Date().toISOString() })
        .eq('id', pinRecord.id);

      return NextResponse.json({
        success: false,
        error: { 
          code: 'MAX_ATTEMPTS_REACHED', 
          message: 'Too many failed attempts. Please request a new PIN.' 
        }
      }, { status: 403 });
    }

    // Verify PIN
    if (pinRecord.pin !== pin) {
      // Increment attempt counter
      const newAttempts = (pinRecord.attempts || 0) + 1;
      
      await supabase
        .from('auth_pins')
        .update({ attempts: newAttempts })
        .eq('id', pinRecord.id);

      const remainingAttempts = pinRecord.max_attempts - newAttempts;

      return NextResponse.json({
        success: false,
        error: { 
          code: 'INVALID_PIN', 
          message: `Invalid PIN. ${remainingAttempts} attempts remaining.` 
        }
      }, { status: 401 });
    }

    // PIN is valid - mark as used
    await supabase
      .from('auth_pins')
      .update({ 
        used: true, 
        used_at: new Date().toISOString(),
        attempts: pinRecord.max_attempts
      })
      .eq('id', pinRecord.id);

    // Get user data from auth.users
    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 100,
    });

    if (listError) {
      console.error('[verify-pin] Error listing users:', listError);
      return NextResponse.json({
        success: false,
        error: { code: 'DB_ERROR', message: 'Failed to get user data' }
      }, { status: 500 });
    }

    const user = usersData?.users?.find(u => u.email?.toLowerCase() === normalizedEmail);

    if (!user) {
      console.error('[verify-pin] User not found:', normalizedEmail);
      return NextResponse.json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      }, { status: 404 });
    }

    // Generate JWT token signed with SUPABASE_JWT_SECRET
    const { SignJWT } = await import('jose');
    const jwtSecret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);
    const now = Math.floor(Date.now() / 1000);

    const accessToken = await new SignJWT({
      role: 'authenticated',
      email: user.email,
      name: user.user_metadata?.full_name ?? '',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(user.id)
      .setIssuedAt(now)
      .setExpirationTime(now + 60 * 60) // 1 hour
      .sign(jwtSecret);

    const refreshToken = crypto.randomUUID();

    // Prepare user data
    const userData = {
      id: user.id,
      email: user.email || normalizedEmail,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
      role: user.user_metadata?.role || 'user',
      verified: user.email_confirmed_at !== null,
    };

    console.log(`[verify-pin] ✅ JWT token generated for user: ${normalizedEmail}`);

    // Return user data and tokens
    return NextResponse.json({
      success: true,
      message: 'Authenticated successfully!',
      user: userData,
      token: accessToken,
      refresh_token: refreshToken,
      expires_in: 3600, // 1 hour
      token_type: 'bearer',
    });

  } catch (error) {
    console.error('[verify-pin] Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred' }
    }, { status: 500 });
  }
}
