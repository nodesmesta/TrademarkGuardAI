"use client"
import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/features/ui/button'
import { ProtectedLayout } from '@/features/auth/components/protected-layout'
import {
  StatCard,
  ViolationsTable,
  RecentActivity,
  AlertCard,
  dashboardData as mockDashboardData,
} from '../components'
import { useRouter } from 'next/navigation'
import { ProductRegistrationForm } from '../components/ProductRegistrationForm'
import ChatBot from '../components/ChatBot'

import type { DashboardData } from '../components/types'

interface Product { id: string; name: string; description?: string; keywords: string[]; active: boolean; created_at: string }

function AlertsPanel({ alerts }: { alerts: any[] }) {
  const [page, setPage] = useState(1)
  const perPage = 3
  const totalPages = Math.ceil(alerts.length / perPage)
  const paginated = alerts.slice((page - 1) * perPage, page * perPage)

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">High Priority Alerts</h2>
        <span className="text-xs text-gray-500">{alerts.length} alerts</span>
      </div>
      {alerts.length === 0 ? (
        <p className="text-sm text-gray-500">No alerts at this time.</p>
      ) : (
        <>
          <div className="space-y-3">
            {paginated.map((alert: any) => <AlertCard key={alert.id} alert={alert} />)}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500">Page {page}/{totalPages}</p>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${p === page ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

function ProductsPanel() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [scanning, setScanning] = useState<string | null>(null)
  const [scanMsg, setScanMsg] = useState<Record<string, string>>({})
  const [page, setPage] = useState(1)
  const perPage = 5
  const fetchProducts = useCallback(async () => {
    const res = await fetch('/api/products', { credentials: 'include' })
    const data = await res.json()
    if (data.success) setProducts(data.products)
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleDelete = async (id: string) => {
    await fetch('/api/products', {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchProducts()
  }

  const handleScan = async (id: string) => {
    setScanning(id)
    setScanMsg((prev) => ({ ...prev, [id]: 'Scanning...' }))
    const res = await fetch(`/api/products/${id}/scan`, {
      method: 'POST',
      credentials: 'include',
    })
    const data = await res.json()
    if (data.success) router.push(`/dashboard/analytics?product=${id}`)
    setScanMsg((prev) => ({
      ...prev,
      [id]: data.success
        ? `Done — ${data.violations} violation(s) found, ${data.scanned} results scanned.`
        : `Error: ${data.error}`,
    }))
    setScanning(null)
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Registered Products</h2>
        <Button size="sm" onClick={() => setShowForm((v) => !v)} className="bg-blue-600 hover:bg-blue-700 text-white">
          {showForm ? 'Cancel' : '+ Add Product'}
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <ProductRegistrationForm onSuccess={() => { setShowForm(false); fetchProducts() }} />
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No products registered yet. Add one to start monitoring.</p>
      ) : (
        <>
          <ul className="space-y-3">
            {products.slice((page - 1) * perPage, page * perPage).map((p) => (
              <li key={p.id} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{p.name}</p>
                  {p.description && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{p.description}</p>}
                  {p.keywords.length > 0 && <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{p.keywords.join(', ')}</p>}
                  {scanMsg[p.id] && <p className="text-xs mt-1 text-green-700 dark:text-green-400">{scanMsg[p.id]}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" disabled={scanning === p.id} onClick={() => handleScan(p.id)} className="text-xs">
                    {scanning === p.id ? 'Scanning...' : 'Scan Now'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(p.id)} className="text-xs text-red-600 hover:text-red-700">
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          {Math.ceil(products.length / perPage) > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500">Page {page} of {Math.ceil(products.length / perPage)} ({products.length} products)</p>
              <div className="flex gap-1">
                {Array.from({ length: Math.ceil(products.length / perPage) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${p === page ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = useCallback(async () => {
    setLoading(true)
    const response = await fetch('/api/dashboard/data', {
      credentials: 'include',
    })
    if (!response.ok) {
      setError(response.status === 401 ? 'Authentication required.' : `Error: ${response.statusText}`)
      setData(mockDashboardData)
    } else {
      const result = await response.json()
      setData(result.success ? result.data : mockDashboardData)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [fetchDashboardData])

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block w-8 h-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const { stats, violations, activities, alerts } = data || mockDashboardData

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <Button variant="outline" onClick={fetchDashboardData} disabled={loading} className="flex items-center gap-2">
          {loading && <span className="mr-2 text-sm">Updating</span>}
          Refresh
        </Button>
      </div>

      {error && (
        <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i: number) => (
          <StatCard key={i} label={stat.label} value={stat.value} change={stat.change} changeType={stat.changeType} icon={stat.icon} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">AI Assistant</h2>
          <ChatBot />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-2xl">🛡</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Trademark AI</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Ask the AI assistant about trademark violations, monitoring strategies, and IP protection tips.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <ViolationsTable violations={violations} />
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg p-6">
          <AlertsPanel alerts={alerts} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <ProductsPanel />
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg p-6">
          <RecentActivity activities={activities} />
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
