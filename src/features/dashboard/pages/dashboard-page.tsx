"use client";
import React, { useState, useEffect } from 'react'
import { Button } from '@/features/ui/button'
import { ProtectedLayout } from '@/features/auth/components/protected-layout'
import { useAuth } from '@/features/auth/hooks/use-auth'
import {
  StatCard,
  ViolationsTable,
  RecentActivity,
  AlertCard,
  dashboardData as mockDashboardData,
} from '../components'

function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }
  return (
    <div
      className={`inline-block animate-spin rounded-full border-blue-600 border-t-transparent ${sizeClasses[size]}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

function DashboardContent() {
  const { user } = useAuth()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    setLoading(true)
    
    // ✅ Get token from localStorage
    const token = localStorage.getItem('token')
    
    const response = await fetch('/api/dashboard/data', {
      headers: token ? { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      } : {}
    })
    if (!response.ok) {
      if (response.status === 401) {
        setError('Authentication required. Please sign in again.')
      } else {
        setError(`Failed to fetch dashboard data: ${response.statusText}`)
      }
      setData(mockDashboardData)
      setLoading(false)
      return
    }
    const result = await response.json()
    if (result.success) {
      setData(result.data)
    } else {
      setError(result.message || 'Failed to load dashboard data')
      setData(mockDashboardData)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const refreshData = async () => {
    setLoading(true)
    
    // ✅ Get token from localStorage
    const token = localStorage.getItem('token')
    
    const response = await fetch('/api/dashboard/data', {
      headers: token ? { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      } : {}
    })
    if (!response.ok) {
      setError(`Refresh failed: ${response.statusText}`)
    } else {
      const result = await response.json()
      setData(result.data)
    }
    setLoading(false)
  }

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 dark:text-red-400 text-xl">!</span>
          </div>
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Failed to Load Dashboard</h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button variant="outline" onClick={refreshData} className="border-red-300 text-red-700 hover:bg-red-50">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const { stats, violations, activities, alerts } = data || mockDashboardData

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name || user?.email?.split('@')[0] || 'User'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Here's what's happening with your trademarks today</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={refreshData} disabled={loading} className="flex items-center">
            {loading && <Spinner size="sm" />}
            <span className="ml-2">Refresh Data</span>
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">New Scan</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat: any, index: number) => (
          <StatCard 
            key={index} 
            label={stat.label} 
            value={stat.value} 
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon} 
          />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <ViolationsTable violations={violations} />
        </div>
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">High Priority Alerts</h2>
              <Button variant="ghost" size="sm" className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {alerts.map((alert: any) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <RecentActivity activities={activities} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedLayout>
      <DashboardContent />
    </ProtectedLayout>
  )
}
