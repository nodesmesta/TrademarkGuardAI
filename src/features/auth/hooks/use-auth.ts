"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, SendPinResult, VerifyPinResult, SignUpResult } from '../types';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  authChecked: boolean;
  sendPin: (email: string) => Promise<SendPinResult>;
  verifyPin: (email: string, pin: string) => Promise<VerifyPinResult>;
  signup: (email: string, name?: string) => Promise<SignUpResult>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  // Initial auth check on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user')
      const storedToken = localStorage.getItem('token')
      
      if (storedUser && storedToken) {
        const user = JSON.parse(storedUser)
        setUser(user)
        console.log('[useAuth] Using localStorage fallback for user:', user.email)
      }
      
      const token = localStorage.getItem('token')
      const response = await fetch('/api/auth/status', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
      if (response.ok) {
        const result = await response.json()
        if (result.authenticated && result.user) {
          setUser(result.user)
          localStorage.setItem('user', JSON.stringify(result.user))
        } else {
          localStorage.removeItem('user')
          localStorage.removeItem('token')
          setUser(null)
        }
      }
      setAuthChecked(true)
    }
    checkAuth()
  }, [])

  const sendPin = async (email: string): Promise<SendPinResult> => {
    setIsLoading(true)
    console.log(`[useAuth] Sending PIN to: ${email}`)
    
    const response = await fetch('/api/auth/send-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    
    const data = await response.json()
    
    if (!data.success) {
      console.warn('[useAuth] Failed to send PIN:', data.error?.message || data.message)
    }
    
    setIsLoading(false)
    return data
  }

  const verifyPin = async (email: string, pin: string): Promise<VerifyPinResult> => {
    setIsLoading(true)
    console.log(`[useAuth] Verifying PIN for: ${email}`)
    
    const response = await fetch('/api/auth/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, pin }),
    })
    
    const data = await response.json()
    
    if (data.success && data.user && data.token) {
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
      // Also store in cookie so middleware can read it server-side
      document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
      setUser(data.user)
      router.push('/dashboard')
    }
    
    setIsLoading(false)
    return data
  }

  const signup = async (email: string, name?: string): Promise<SignUpResult> => {
    setIsLoading(true)
    console.log(`[useAuth] Signing up: ${email} (${name || 'no name'})`)
    
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    })
    
    const data = await response.json()
    
    if (!data.success) {
      console.warn('[useAuth] Failed to create account:', data.error?.message || data.message)
    }
    
    setIsLoading(false)
    return data
  }

  const checkAuthStatus = async (): Promise<boolean> => {
    const token = localStorage.getItem('token')
    const response = await fetch('/api/auth/status', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
    if (response.ok) {
      const result = await response.json()
      if (result.authenticated && result.user) {
        setUser(result.user)
        localStorage.setItem('user', JSON.stringify(result.user))
        return true
      }
    }
    return false
  };

  const logout = async () => {
    console.log('[useAuth] Logging out...')
    
    const token = localStorage.getItem('token')
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).catch((e) => console.error('[useAuth] Logout request failed:', e))
    
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    document.cookie = 'token=; path=/; max-age=0'
    
    setUser(null)
    router.push('/signin')
  };

  return {
    user,
    isLoading,
    authChecked,
    sendPin,
    verifyPin,
    signup,
    logout,
    checkAuthStatus,
  };
}
