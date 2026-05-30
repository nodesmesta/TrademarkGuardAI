"use client"
import React, { useEffect, useState, useCallback } from 'react'
import AlertCard from '@/features/dashboard/components/AlertCard'

interface Alert {
  id: string
  title: string
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  timestamp: string
  actionRequired: boolean
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAlerts = useCallback(async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token') ?? ''
      const res = await fetch('/api/dashboard/data', { credentials: 'include', headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setAlerts(json.success && Array.isArray(json.data?.alerts) ? json.data.alerts : [])
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 30000)
    return () => clearInterval(interval)
  }, [fetchAlerts])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 dark:text-gray-400">Loading alerts...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">High Priority Alerts</h1>
      {error && (
        <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">{error}</div>
      )}
      {alerts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No alerts at this time.</p>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)}
        </div>
      )}
    </div>
  )
}
