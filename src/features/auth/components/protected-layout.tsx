'use client'
import AuthGuard from './auth-guard'
import { useAuth } from '../hooks/use-auth'

interface ProtectedLayoutProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedLayout({ 
  children, 
  fallback 
}: ProtectedLayoutProps) {
  const { isLoading } = useAuth()
  
  if (isLoading && fallback) {
    return <>{fallback}</>
  }
  
  return (
    <AuthGuard requireAuth={true}>
      {children}
    </AuthGuard>
  )
}

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireAuth={false}>
      {children}
    </AuthGuard>
  )
}