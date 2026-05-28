'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  sendPin: (email: string) => Promise<{ success: boolean; message: string; devPin?: string }>
  verifyPin: (email: string, pin: string) => Promise<{ success: boolean; message: string; user?: User }>
  signup: (email: string, name: string) => Promise<{ success: boolean; message: string; user?: User }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const sendPin = async (email: string) => {
    setIsLoading(true)
    const response = await fetch('/api/auth/send-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await response.json()
    setIsLoading(false)

    if (data.success) {
      return { 
        success: true, 
        message: data.message || 'PIN sent',
        devPin: data.devPin
      }
    }
    return { 
      success: false, 
      message: data.error?.message || data.message || 'Failed to send PIN' 
    }
  }

  const verifyPin = async (email: string, pin: string) => {
    setIsLoading(true)
    const response = await fetch('/api/auth/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, pin }),
    })
    const data = await response.json()
    setIsLoading(false)

    if (data.success && data.user && data.token) {
      // ✅ Store in localStorage only (NO COOKIES)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
      setUser(data.user)
      
      // ✅ NO COOKIES: Skip /api/auth/callback call
      // Token is now stored in localStorage and used via Authorization header
      
      console.log('[useAuth] Auth successful. Token stored in localStorage.')
      
      // ✅ Navigate immediately after successful login
      router.push('/dashboard')
    }

    return data
  }

  const signup = async (email: string, name: string) => {
    setIsLoading(true)
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    })
    const data = await response.json()
    setIsLoading(false)

    if (data.success && data.user) {
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      router.push('/dashboard')
    }

    return {
      success: data.success,
      message: data.message || 'Account created',
      user: data.user
    }
  }

  const logout = async () => {
    // Destroy Supabase session — send token so server can invalidate the correct session
    const token = localStorage.getItem('token')
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).catch((e) => console.error('[AuthContext] Logout request failed:', e))
    
    // Clear localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    
    setUser(null)
    router.push('/signin')
  }

  const value = {
    user,
    isLoading,
    sendPin,
    verifyPin,
    signup,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    return {
      user: null,
      isLoading: false,
      sendPin: async () => ({ success: false, message: 'Auth not available' }),
      verifyPin: async () => ({ success: false, message: 'Auth not available' }),
      signup: async () => ({ success: false, message: 'Auth not available' }),
      logout: () => {},
    } as any
  }
  return context
}
