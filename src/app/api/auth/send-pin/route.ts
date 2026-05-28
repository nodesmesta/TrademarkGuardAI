import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/utils/supabase/server';
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/auth/send-pin
 * 
 * Generates a 6-digit PIN and sends it via email using Resend.
 * 
 * Features:
 * - Checks if user exists in auth.users
 * - Generates random 6-digit PIN
 * - Stores PIN in auth_pins table with 10-minute expiry
 * - Implements rate limiting (max 3 requests per hour per email)
 * - Sends PIN via email using Resend
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const normalizedEmail = email.toLowerCase().trim();

    // Validate email format
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({
        success: false,
        error: { code: 'INVALID_EMAIL', message: 'Please enter a valid email address' }
      }, { status: 400 });
    }

    // Create admin client
    const supabase = await createAdminSupabaseClient();

    // Check if user exists
    const { data: users, error: listError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 100,
    });

    if (listError) {
      console.error('[send-pin] Error listing users:', listError);
      return NextResponse.json({
        success: false,
        error: { code: 'DB_ERROR', message: 'Failed to check user existence' }
      }, { status: 500 });
    }

    const userExists = users?.users?.some(u => u.email?.toLowerCase() === normalizedEmail);

    if (!userExists) {
      return NextResponse.json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'No account found with this email. Please sign up first.' }
      }, { status: 404 });
    }

    // Check rate limiting (max 3 PIN requests per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentRequests } = await supabase
      .from('auth_pins')
      .select('id')
      .eq('email', normalizedEmail)
      .gte('created_at', oneHourAgo)
      .limit(3);

    if (recentRequests && recentRequests.length >= 3) {
      return NextResponse.json({
        success: false,
        error: { 
          code: 'RATE_LIMITED', 
          message: 'Too many PIN requests. Please wait 1 hour before trying again.' 
        }
      }, { status: 429 });
    }

    // Generate 6-digit PIN
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalidate any existing active PINs for this email
    await supabase
      .from('auth_pins')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('email', normalizedEmail)
      .eq('used', false);

    // Store PIN in database
    const { error: insertError } = await supabase
      .from('auth_pins')
      .insert({
        email: normalizedEmail,
        pin: pin,
        expires_at: expiresAt.toISOString(),
        used: false,
        attempts: 0,
        max_attempts: 3,
      });

    if (insertError) {
      console.error('[send-pin] Error storing PIN:', insertError);
      return NextResponse.json({
        success: false,
        error: { code: 'DB_ERROR', message: 'Failed to store PIN' }
      }, { status: 500 });
    }

    // Send PIN via email using Resend
    let emailSent = false;
    let emailErrorMessage = '';
    
    try {
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: 'TradeGuard AI <auth@nodesemesta.com>',
        to: [normalizedEmail],
        subject: 'Your PIN Code for TradeGuard AI',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Your PIN Code</h2>
            <p>Hello,</p>
            <p>Your PIN code for TradeGuard AI is:</p>
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <h1 style="color: #2563eb; font-size: 36px; letter-spacing: 8px; margin: 0; font-weight: bold;">
                ${pin}
              </h1>
            </div>
            <p>This PIN will expire in <strong>10 minutes</strong>.</p>
            <p>If you didn't request this PIN, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="color: #666; font-size: 14px;">
              This is an automated message from TradeGuard AI.
            </p>
          </div>
        `,
      });

      if (emailError) {
        emailSent = false;
        emailErrorMessage = emailError.message;
        console.error(`[send-pin] Email send failed for ${normalizedEmail}:`, emailError.message);
        
        // Check if it's a domain verification issue
        if (emailError.name === 'validation_error' && emailError.message.includes('verify a domain')) {
          console.warn(`[send-pin] ⚠️ Domain not verified. Please verify domain at https://resend.com/domains`);
          console.warn(`[send-pin] For now, you can only send to: nodesemesta@gmail.com`);
        }
      } else {
        emailSent = true;
        console.log(`[send-pin] ✅ Email sent successfully to ${normalizedEmail}: ${emailData.id}`);
      }
    } catch (emailSendError) {
      console.error('[send-pin] Email send exception:', emailSendError);
      emailErrorMessage = String(emailSendError);
    }

    // Log PIN for development and debugging
    console.log(`\n🔐 PIN for ${normalizedEmail}: ${pin}`);
    console.log(`⏰ Expires at: ${expiresAt.toISOString()}`);
    if (emailSent) {
      console.log(`📧 Email sent via Resend ✅`);
    } else {
      console.log(`📧 Email failed: ${emailErrorMessage}`);
      console.log(`💡 TIP: Check Resend domain verification at https://resend.com/domains`);
    }
    console.log('');

    return NextResponse.json({
      success: true,
      message: 'PIN sent to your email successfully',
    });

  } catch (error) {
    console.error('[send-pin] Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred' }
    }, { status: 500 });
  }
}
