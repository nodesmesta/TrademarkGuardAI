'use client'
import { useAuth } from '../hooks/use-auth'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export default function AuthGuard({
  children,
  requireAuth = true
}: AuthGuardProps) {
  const { user, authChecked } = useAuth()
  
  // Wait for auth check
  if (!authChecked) return null
  
  // Guard check: require auth but not logged in
  if (requireAuth && !user) return null
  
  // Guard check: don't require auth but logged in (optional)
  if (!requireAuth && user) return null
  
  return <>{children}</>
}