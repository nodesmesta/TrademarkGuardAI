"use client"
import React, { useEffect, useState, useCallback } from 'react'
import { Card, cn } from '@/features/ui'
import { Package, ScanLine, AlertTriangle, Globe, ExternalLink, RefreshCw } from 'lucide-react'

interface Product { id: string; name: string; keywords: string[]; platforms: string[] }
interface Activity { id: string; action: string; target: string; timestamp: string; type: string }
interface Violation { id: string; platform: string; brand: string; title: string; url: string; seller: string; detected: string }
interface PlatformBreakdown { platform: string; scanned: number; violations: number }

const PLATFORM_COLORS: Record<string, string> = {
  marketplace: 'from-blue-500 to-blue-600',
  amazon: 'from-orange-500 to-orange-600',
  instagram: 'from-pink-500 to-pink-600',
  tiktok: 'from-gray-700 to-gray-900',
  x: 'from-gray-500 to-gray-700',
}

const PLATFORM_BADGE: Record<string, string> = {
  marketplace: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  amazon: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  instagram: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  tiktok: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  x: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
}

export default function Monitoring() {
  const [products, setProducts] = useState<Product[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [violations, setViolations] = useState<Violation[]>([])
  const [platformBreakdown, setPlatformBreakdown] = useState<PlatformBreakdown[]>([])
  const [totalScans, setTotalScans] = useState(0)
  const [totalViolations, setTotalViolations] = useState(0)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
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
        setTotalScans(parseInt(d.stats?.find((s: { label: string }) => s.label === 'Total Scans')?.value || '0', 10))
        setTotalViolations(parseInt(d.stats?.find((s: { label: string }) => s.label === 'Violations')?.value || '0', 10))
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(() => fetchData(), 10000)
    return () => clearInterval(interval)
  }, [fetchData])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block w-8 h-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading monitoring data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Monitoring</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time trademark violation monitoring</p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium",
            "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
            "hover:bg-gray-50 dark:hover:bg-gray-700 transition-all",
            "text-gray-700 dark:text-gray-300"
          )}
        >
          <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniStatCard icon={<Package className="w-5 h-5" />} label="Products" value={products.length} gradient="from-blue-500 to-blue-600" bg="bg-blue-500" />
        <MiniStatCard icon={<ScanLine className="w-5 h-5" />} label="Total Scans" value={totalScans} gradient="from-purple-500 to-purple-600" bg="bg-purple-500" />
        <MiniStatCard icon={<AlertTriangle className="w-5 h-5" />} label="Violations" value={totalViolations} gradient="from-red-500 to-red-600" bg="bg-red-500" />
        <MiniStatCard icon={<Globe className="w-5 h-5" />} label="Platforms" value={platformBreakdown.length} gradient="from-green-500 to-green-600" bg="bg-green-500" />
      </div>

      {/* Platform Breakdown */}
      {platformBreakdown.length > 0 && (
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Platform Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {platformBreakdown.map(p => (
              <div key={p.platform} className="flex items-center justify-between p-4 rounded-xl bg-gray-50/80 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600/50">
                <div className="flex items-center gap-3">
                  <div className={cn("w-3 h-3 rounded-full bg-gradient-to-r", PLATFORM_COLORS[p.platform] ?? 'from-gray-400 to-gray-500')} />
                  <span className={cn("px-2.5 py-1 rounded-lg text-xs font-semibold", PLATFORM_BADGE[p.platform] ?? 'bg-gray-100 text-gray-700')}>
                    {p.platform}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{p.violations}</p>
                  <p className="text-xs text-gray-500">{p.scanned} scanned</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Violations Table */}
      {violations.length > 0 && (
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Violations</h2>
            <span className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-lg">
              {violations.length} found
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 pr-4">Platform</th>
                  <th className="pb-3 pr-4">Brand</th>
                  <th className="pb-3 pr-4">Title</th>
                  <th className="pb-3 pr-4">Seller</th>
                  <th className="pb-3">Detected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {violations.slice(0, 20).map(v => (
                  <tr key={v.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="py-3 pr-4">
                      <span className={cn("px-2.5 py-1 rounded-lg text-xs font-semibold", PLATFORM_BADGE[v.platform] ?? 'bg-gray-100 text-gray-700')}>
                        {v.platform}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">{v.brand}</td>
                    <td className="py-3 pr-4 max-w-[200px]">
                      {v.url ? (
                        <a href={v.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline truncate">
                          <span className="truncate">{v.title || v.url}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : <span className="text-gray-600 dark:text-gray-300 truncate">{v.title}</span>}
                    </td>
                    <td className="py-3 pr-4 text-gray-500 dark:text-gray-400 text-xs">{v.seller}</td>
                    <td className="py-3 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">
                      {new Date(v.detected).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Activity Feed */}
      {activities.length > 0 && (
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Activity Feed</h2>
          <div className="space-y-3">
            {activities.map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-600/30">
                <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", a.type === 'warning' ? 'bg-red-500' : 'bg-green-500')} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{a.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{a.target}</p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                  {new Date(a.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Empty State */}
      {totalScans === 0 && (
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <ScanLine className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Scans Yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Go to Dashboard and click &quot;Scan Now&quot; on a product to start monitoring.</p>
        </Card>
      )}
    </div>
  )
}

function MiniStatCard({ icon, label, value, gradient, bg }: { icon: React.ReactNode; label: string; value: number; gradient: string; bg: string }) {
  return (
    <Card className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-[1.02]">
      <div className={cn("absolute top-0 right-0 w-24 h-24 opacity-10 blur-2xl group-hover:opacity-20 transition-opacity", bg)} />
      <div className="relative p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className={cn("p-2.5 rounded-xl shadow-lg bg-gradient-to-br text-white", gradient)}>
          {icon}
        </div>
      </div>
    </Card>
  )
}
