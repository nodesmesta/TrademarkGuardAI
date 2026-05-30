"use client"
import React, { useEffect, useState, useCallback } from 'react'
import { Card, cn } from '@/features/ui'
import { Bell, RefreshCw } from 'lucide-react'
import AlertCard from '@/features/dashboard/components/AlertCard'

interface Alert { id: string; title: string; description: string; priority: 'critical' | 'high' | 'medium' | 'low'; timestamp: string; actionRequired: boolean }

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard/data', { credentials: 'include' })
      if (!res.ok) return
      const json = await res.json()
      setAlerts(json.success && Array.isArray(json.data?.alerts) ? json.data.alerts : [])
    } finally { setLoading(false) }
  }, [])

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 30000)
    return () => clearInterval(interval)
  }, [fetchAlerts])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="inline-block w-8 h-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Alerts</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">High priority notifications requiring attention</p>
        </div>
        <button onClick={() => { setLoading(true); fetchAlerts() }} className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium",
          "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
          "hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-gray-700 dark:text-gray-300"
        )}>
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {alerts.length === 0 ? (
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">All Clear</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">No alerts at this time. Your trademarks are safe.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
        </div>
      )}
    </div>
  )
}
