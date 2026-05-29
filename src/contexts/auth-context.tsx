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
      message: data.error || data.message || 'Failed to send PIN' 
    }
  }

  const verifyPin = async (email: string, pin: string) => {
    setIsLoading(true)
    const response = await fetch('/api/auth/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, pin }),
    })
    const data = await response.json()
    setIsLoading(false)

    if (data.success && data.user && data.token) {
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
      // Set cookie for middleware - use hard navigation so cookie is sent with next request
      document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
      setUser(data.user)
      // Hard navigation ensures cookie is included in the request to /dashboard
      window.location.href = '/dashboard'
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
    const token = localStorage.getItem('token')
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).catch((e) => console.error('[AuthContext] Logout request failed:', e))
    
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    // Clear cookie
    document.cookie = 'token=; path=/; max-age=0; SameSite=Lax'
    
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
