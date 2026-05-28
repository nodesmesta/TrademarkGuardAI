'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/use-auth'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { user, authChecked } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authChecked) return
    if (requireAuth && !user) router.replace('/signin')
    if (!requireAuth && user) router.replace('/dashboard')
  }, [authChecked, user, requireAuth, router])

  if (!authChecked) return null
  if (requireAuth && !user) return null
  if (!requireAuth && user) return null

  return <>{children}</>
}
