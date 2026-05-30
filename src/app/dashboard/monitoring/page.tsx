"use client"
import React, { useEffect, useState, useCallback } from 'react'

interface Product { id: string; name: string; keywords: string[]; platforms: string[]; active: boolean }
interface Activity { id: string; action: string; target: string; timestamp: string; type: string }
interface Violation { id: string; platform: string; brand: string; title: string; url: string; seller: string; detected: string }
interface PlatformBreakdown { platform: string; scanned: number; violations: number }

const PLATFORM_COLORS: Record<string, string> = {
  marketplace: 'bg-blue-100 text-blue-800',
  amazon: 'bg-orange-100 text-orange-800',
  google: 'bg-blue-100 text-blue-800',
  instagram: 'bg-pink-100 text-pink-800',
  tiktok: 'bg-gray-900 text-white',
  x: 'bg-gray-100 text-gray-800',
}

export default function Monitoring() {
  const [products, setProducts] = useState<Product[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [violations, setViolations] = useState<Violation[]>([])
  const [platformBreakdown, setPlatformBreakdown] = useState<PlatformBreakdown[]>([])
  const [totalScans, setTotalScans] = useState(0)
  const [totalViolations, setTotalViolations] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard/data', { credentials: 'include' })
      if (!res.ok) return
      const json = await res.json()
      if (json.success) {
        const d = json.data
        setProducts(d.products || [])
        setActivities(d.activities || [])
        setViolations(d.violations || [])
        setPlatformBreakdown(d.platformBreakdown || [])
        const scans = d.stats?.find((s: { label: string }) => s.label === 'Total Scans')
        const viols = d.stats?.find((s: { label: string }) => s.label === 'Violations')
        setTotalScans(parseInt(scans?.value || '0', 10))
        setTotalViolations(parseInt(viols?.value || '0', 10))
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [fetchData])

  if (loading) {
    return <div className="p-6"><p className="text-gray-500">Loading monitoring data...</p></div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Monitoring</h1>
        <button onClick={() => { setLoading(true); fetchData() }} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          ↻ Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Products Monitored" value={products.length} color="text-blue-600" />
        <StatCard label="Total Scans" value={totalScans} color="text-purple-600" />
        <StatCard label="Violations Found" value={totalViolations} color="text-red-600" />
        <StatCard label="Platforms" value={platformBreakdown.length} color="text-green-600" />
      </div>

      {/* Platform Breakdown */}
      {platformBreakdown.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Platform Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {platformBreakdown.map(p => (
              <div key={p.platform} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${PLATFORM_COLORS[p.platform] ?? 'bg-gray-100 text-gray-700'}`}>
                  {p.platform}
                </span>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{p.violations} violations</p>
                  <p className="text-xs text-gray-500">{p.scanned} scanned</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Violations */}
      {violations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Violations</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 pr-4">Platform</th>
                  <th className="pb-3 pr-4">Brand</th>
                  <th className="pb-3 pr-4">Title</th>
                  <th className="pb-3 pr-4">Seller</th>
                  <th className="pb-3">Detected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {violations.slice(0, 20).map(v => (
                  <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-2 pr-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${PLATFORM_COLORS[v.platform] ?? 'bg-gray-100 text-gray-700'}`}>
                        {v.platform}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-gray-700 dark:text-gray-300 font-medium">{v.brand}</td>
                    <td className="py-2 pr-4">
                      {v.url ? (
                        <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate block max-w-[200px]">
                          {v.title || v.url}
                        </a>
                      ) : v.title}
                    </td>
                    <td className="py-2 pr-4 text-gray-500 text-xs">{v.seller}</td>
                    <td className="py-2 text-gray-500 text-xs whitespace-nowrap">{new Date(v.detected).toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {activities.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activities.map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <span className={`w-2 h-2 rounded-full shrink-0 ${a.type === 'warning' ? 'bg-red-500' : 'bg-green-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white font-medium">{a.action}</p>
                  <p className="text-xs text-gray-500 truncate">{a.target}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(a.timestamp).toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {totalScans === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No scan data yet. Go to Dashboard and click "Scan Now" on a product to start monitoring.</p>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  )
}
