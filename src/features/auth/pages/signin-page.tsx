'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth';
import { Button, Card, Input, Spinner, Link } from '@heroui/react';
import { Mail, ArrowRight, Shield, AlertCircle, CheckCircle, Key } from 'lucide-react';

function SignInContent() {
  const router = useRouter();
  const { sendPin, verifyPin, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [step, setStep] = useState<'email' | 'pin'>('email');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const search = window.location.search || window.location.hash.substring(1);
    const params = new URLSearchParams(search);
    
    let accessToken = params.get('access_token') || params.get('token');
    const refreshToken = params.get('refresh_token') || '';
    const expiresAt = params.get('expires_at') || '';
    const type = params.get('type') || '';
    
    console.log('[auth/signin] URL detected:', {
      search: window.location.search,
      hash: window.location.hash,
      accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : 'none',
    });
    
    if (accessToken) {
      console.log('[auth/signin] Token detected, calling callback API');
      const query = new URLSearchParams({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: expiresAt,
        type: type,
      }).toString();
      
      fetch(`/api/auth/callback?${query}`, { credentials: 'include' })
        .then((res) => {
          console.log('[auth/signin] Callback response status:', res.status);
          return res.json();
        })
        .then((data) => {
          console.log('[auth/signin] Callback response:', data);
          if (data.success) {
            const clean = window.location.origin + window.location.pathname;
            window.history.replaceState(null, '', clean);
            console.log('[auth/signin] Redirecting to dashboard...');
            router.replace('/dashboard');
          } else {
            console.error('[auth/signin] Callback failed:', data.error);
            setMessage({ 
              text: `Authentication failed: ${data.error || 'Unknown error'}`, 
              type: 'error' 
            });
          }
        })
        .catch((err) => {
          console.error('[auth/signin] Callback error:', err);
          setMessage({ 
            text: `Authentication error: ${err.message}`, 
            type: 'error' 
          });
        });
    }
  }, [router]);

  const validateEmail = (mail: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);

  const handleSendPin = async () => {
    setMessage(null);
    if (!validateEmail(email)) {
      setMessage({ text: 'Please enter a valid email address', type: 'error' });
      return;
    }
    
    const result = await sendPin(email);
    if (result.success) {
      setMessage({ 
        text: 'PIN has been sent to your email. Please check your inbox and enter the 6-digit code.', 
        type: 'success' 
      });
      setStep('pin');
    } else {
      setMessage({ 
        text: result.error?.message || 'Failed to send PIN. Please try again.', 
        type: 'error' 
      });
    }
  };

  const handleVerifyPin = async () => {
    setMessage(null);
    if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setMessage({ text: 'Please enter a valid 6-digit PIN', type: 'error' });
      return;
    }

    const result = await verifyPin(email, pin);
    if (result.success) {
      setMessage({ 
        text: 'Login successful! Redirecting to dashboard...', 
        type: 'success' 
      });
    } else {
      setMessage({ 
        text: result.error?.message || 'Invalid PIN. Please try again.', 
        type: 'error' 
      });
      setPin('');
    }
  };

  const handleResendPin = async () => {
    setMessage(null);
    const result = await sendPin(email);
    if (result.success) {
      setMessage({ 
        text: 'New PIN sent to your email. Please check your inbox.', 
        type: 'success' 
      });
      setPin('');
    } else {
      setMessage({ 
        text: result.error?.message || 'Failed to resend PIN. Please try again.', 
        type: 'error' 
      });
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setMessage(null);
    setPin('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (step === 'email') {
        handleSendPin();
      } else {
        handleVerifyPin();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4">
      <div className="w-full max-w-md">
        <Card className="p-6 md:p-8 shadow-2xl dark:shadow-gray-900/30 border dark:border-gray-800">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl blur bg-gradient-to-br from-blue-500 to-purple-600 opacity-70" />
                <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-xl">TradeGuard AI</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Trademark Protection Platform</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {step === 'email' ? 'Welcome Back' : 'Enter Your PIN'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {step === 'email' 
                ? 'Access your trademark protection dashboard' 
                : 'Enter the 6-digit PIN sent to your email'}
            </p>
          </div>

          {/* Step indicator */}
          {step === 'pin' && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Step 2 of 2</span>
                <button 
                  onClick={handleBackToEmail}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Change email
                </button>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="space-y-6">
            {step === 'email' ? (
              /* Email input step */
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-10"
                    onKeyDown={handleKeyDown}
                    aria-label="Email Address"
                  />
                </div>
                {email && !validateEmail(email) && (
                  <p className="mt-2 text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Invalid email address
                  </p>
                )}
              </div>
            ) : (
              /* PIN input step */
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  6-Digit PIN
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder=""
                    value={pin}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setPin(value);
                    }}
                    disabled={isLoading}
                    className="w-full pl-10 text-center text-2xl tracking-widest"
                    onKeyDown={handleKeyDown}
                    aria-label="6-Digit PIN"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                  PIN sent to <strong>{email}</strong>
                </p>
              </div>
            )}

            {/* Action button */}
            <Button
              onClick={() => {
                if (step === 'email') {
                  handleSendPin();
                } else {
                  handleVerifyPin();
                }
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium py-3"
              isDisabled={isLoading || (step === 'email' && (!email || !validateEmail(email))) || (step === 'pin' && pin.length !== 6)}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" className="mr-2" /> 
                  {step === 'email' ? 'Sending PIN...' : 'Verifying...'}
                </>
              ) : (
                <>
                  {step === 'email' ? 'Send PIN' : 'Sign In'} 
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            {/* Resend PIN button (only in pin step) */}
            {step === 'pin' && (
              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResendPin}
                  isDisabled={isLoading}
                  className="text-blue-600 dark:text-blue-400"
                >
                  Resend PIN
                </Button>
              </div>
            )}

            {/* Feedback message */}
            {message && (
              <div className={`p-3 rounded-lg border ${
                message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : message.type === 'error'
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              }`}>
                <div className="flex items-center gap-2">
                  {message.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  ) : message.type === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                  <p className={`text-sm ${
                    message.type === 'success'
                      ? 'text-green-800 dark:text-green-300'
                      : message.type === 'error'
                      ? 'text-red-800 dark:text-red-300'
                      : 'text-blue-800 dark:text-blue-300'
                  }`}>
                    {message.text}
                  </p>
                </div>
              </div>
            )}

            {/* Footer links */}
            <div className="relative my-6">
              <hr className="border-gray-300 dark:border-gray-700" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white dark:bg-gray-900 px-2 text-xs text-gray-500 dark:text-gray-400 uppercase">
                  {step === 'email' ? "Don't have an account?" : 'Already have an account?'}
                </span>
              </div>
            </div>
            
            <div className="text-center">
              <Link 
                href={step === 'email' ? '/signup' : '/signup'} 
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                {step === 'email' ? 'Create a new account' : 'Sign up'}
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen">
      <SignInContent />
    </div>
  );
}
