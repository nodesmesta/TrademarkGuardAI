"use client"
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

interface MonitoringRow {
  id: string
  platform: string
  search_query: string
  violation_count: number
  results: unknown[]
  violations: { title?: string; url?: string; seller?: string }[]
  completed_at: string
}

const PLATFORM_COLORS: Record<string, string> = {
  amazon: 'bg-orange-500',
  google: 'bg-blue-500',
  instagram: 'bg-pink-500',
  tiktok: 'bg-black',
  x: 'bg-gray-800',
}

export default function AnalyticsClient() {
  const searchParams = useSearchParams()
  const productId = searchParams?.get('product')
  const [rows, setRows] = useState<MonitoringRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!productId) { setLoading(false); return }
    const token = localStorage.getItem('token') ?? ''
    fetch(`/api/products/${productId}/monitoring-results`, { credentials: 'include', headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setRows(d.monitoringResults ?? [])
        else setError(d.error ?? 'Failed to load')
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [productId])

  if (!productId) return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analytics</h1>
      <p className="text-gray-500">Select a product from Dashboard and run a scan first.</p>
    </div>
  )

  const totalScanned = rows.reduce((s, r) => s + (r.results?.length ?? 0), 0)
  const totalViolations = rows.reduce((s, r) => s + (r.violation_count ?? 0), 0)
  const platforms = [...new Set(rows.map((r) => r.platform))]

  const platformStats = platforms.map((p) => {
    const pRows = rows.filter((r) => r.platform === p)
    return {
      platform: p,
      scanned: pRows.reduce((s, r) => s + (r.results?.length ?? 0), 0),
      violations: pRows.reduce((s, r) => s + (r.violation_count ?? 0), 0),
    }
  })

  const allViolations = rows.flatMap((r) =>
    (r.violations ?? []).map((v) => ({ ...v, platform: r.platform, query: r.search_query, date: r.completed_at }))
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Scanned', value: totalScanned, color: 'text-blue-600' },
              { label: 'Violations', value: totalViolations, color: 'text-red-600' },
              { label: 'Platforms', value: platforms.length, color: 'text-purple-600' },
              { label: 'Scan Runs', value: rows.length, color: 'text-green-600' },
            ].map((s) => (
              <div key={s.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
                <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Breakdown per Platform</h2>
            {platformStats.length === 0 ? (
              <p className="text-gray-500 text-sm">No scan data yet. Run a scan from the Dashboard.</p>
            ) : (
              <div className="space-y-3">
                {platformStats.map((p) => {
                  const pct = totalScanned > 0 ? Math.round((p.scanned / totalScanned) * 100) : 0
                  return (
                    <div key={p.platform}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium capitalize text-gray-700 dark:text-gray-300">{p.platform}</span>
                        <span className="text-gray-500">{p.scanned} scanned · <span className="text-red-500 font-semibold">{p.violations} violations</span></span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${PLATFORM_COLORS[p.platform] ?? 'bg-gray-400'}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {allViolations.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Detected Violations ({allViolations.length})</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700">
                      <th className="pb-2 pr-4">Platform</th>
                      <th className="pb-2 pr-4">Title</th>
                      <th className="pb-2 pr-4">Seller</th>
                      <th className="pb-2">URL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {allViolations.slice(0, 50).map((v, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-2 pr-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-white text-xs font-medium ${PLATFORM_COLORS[v.platform] ?? 'bg-gray-400'}`}>{v.platform}</span>
                        </td>
                        <td className="py-2 pr-4 max-w-xs truncate text-gray-700 dark:text-gray-300">{v.title ?? '—'}</td>
                        <td className="py-2 pr-4 text-gray-500">{v.seller ?? '—'}</td>
                        <td className="py-2">
                          {v.url ? (
                            <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate block max-w-xs">{v.url}</a>
                          ) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
