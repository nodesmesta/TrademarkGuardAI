import { supabase } from '@/lib/supabase-client';
import {
  SendPinResult,
  VerifyPinResult,
  SignUpResult,
  IAuthService,
  User,
} from '../types';
export class AuthService implements IAuthService {
  async sendPin(email: string): Promise<SendPinResult> {
    if (!email || typeof email !== 'string') {
      return { success: false, error: { code: 'INVALID_EMAIL', message: 'Email required' } };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: { code: 'INVALID_EMAIL', message: 'Invalid email address' } };
    }
    const normalized = email.toLowerCase().trim();
    const appUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    const callbackUrl = `${appUrl}/signin`;
    const { error } = await supabase.auth.signInWithOtp({
      email: normalized,
      options: { 
        emailRedirectTo: callbackUrl,
        shouldCreateUser: true,
      },
    });
    if (error) {
      return { success: false, error: { code: 'SEND_PIN_FAILED', message: error.message } };
    }
    return { 
      success: true, 
      data: { 
        message: 'Magic link sent. Please check your email and click the link to authenticate.'
      } 
    };
  }
  async verifyPin(email: string, otp?: string): Promise<VerifyPinResult> {
    if (!email) {
      return { 
        success: false, 
        error: { code: 'MISSING_EMAIL', message: 'Email is required' } 
      };
    }
    const normalizedEmail = email.toLowerCase().trim();
    if (otp && otp.length > 0) {
      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        email: normalizedEmail,
        token: otp,
        type: 'email',
      });
      if (verifyError) {
        const errorMessage = verifyError.message.toLowerCase();
        if (errorMessage.includes('invalid') || errorMessage.includes('expired')) {
          return { 
            success: false, 
            error: { 
              code: 'INVALID_OTP', 
              message: 'Invalid or expired OTP. Please request a new one.' 
            } 
          };
        }
        if (errorMessage.includes('rate limit')) {
          return { 
            success: false, 
            error: { 
              code: 'RATE_LIMIT', 
              message: 'Too many verification attempts. Please wait before trying again.' 
            } 
          };
        }
        return { 
          success: false, 
          error: { code: 'VERIFY_FAILED', message: verifyError.message } 
        };
      }
      if (!verifyData.user) {
        return { 
          success: false, 
          error: { code: 'VERIFY_FAILED', message: 'OTP verification succeeded but no user found' } 
        };
      }
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        return { 
          success: false, 
          error: { code: 'SESSION_ERROR', message: 'Session not created after OTP verification' } 
        };
      }
      const user = sessionData.session.user;
      return {
        success: true,
        data: {
          user: { 
            id: user.id, 
            email: user.email ?? '', 
            name: user.user_metadata?.full_name ?? '' 
          } as User,
          token: sessionData.session.access_token,
          message: 'Authenticated via OTP',
        },
      };
    }
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      return { 
        success: false, 
        error: { code: 'VERIFY_FAILED', message: error.message } 
      };
    }
    if (!data.session) {
      return { 
        success: false, 
        error: { code: 'NO_SESSION', message: 'No active session. Please click the magic link in your email.' } 
      };
    }
    const user = data.session.user;
    return {
      success: true,
      data: {
        user: { 
          id: user.id, 
          email: user.email ?? '', 
          name: user.user_metadata?.full_name ?? '' 
        } as User,
        token: data.session.access_token,
        message: 'Authenticated via magic link',
      },
    };
  }
  async signUp(email: string, _name?: string): Promise<SignUpResult> {
    const result = await this.sendPin(email);
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return { 
      success: true, 
      data: { 
        message: 'Account creation link sent to your email. Please click the link to create your account.',
        user: null as unknown as User
      } 
    };
  }
  async logout(): Promise<void> {
    await supabase.auth.signOut();
  }
}