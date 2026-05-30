"use client"
import React, { useEffect, useState } from 'react'

interface Row {
  id: string
  platform: string
  search_query: string
  violation_count: number
  results: unknown[]
  completed_at: string
  triggered_by?: string
}

const PLATFORM_COLORS: Record<string, string> = {
  amazon: 'bg-orange-100 text-orange-800',
  google: 'bg-blue-100 text-blue-800',
  instagram: 'bg-pink-100 text-pink-800',
  tiktok: 'bg-gray-900 text-white',
  x: 'bg-gray-100 text-gray-800',
}

export default function ReportsPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [products, setProducts] = useState<{ id: string; name: string }[]>([])
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token') ?? ''
    fetch('/api/products', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.products.length) {
          setProducts(d.products)
          setSelected(d.products[0].id)
        }
      })
  }, [])

  useEffect(() => {
    if (!selected) return
    setLoading(true)
    const token = localStorage.getItem('token') ?? ''
    fetch(`/api/products/${selected}/monitoring-results`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setRows(d.monitoringResults ?? []))
      .finally(() => setLoading(false))
  }, [selected])

  const totalScanned = rows.reduce((s, r) => s + ((r.results as unknown[])?.length ?? 0), 0)
  const totalViolations = rows.reduce((s, r) => s + (r.violation_count ?? 0), 0)
  const platforms = [...new Set(rows.map((r) => r.platform))]

  const platformSummary = platforms.map((p) => {
    const pRows = rows.filter((r) => r.platform === p)
    return {
      platform: p,
      scans: pRows.length,
      violations: pRows.reduce((s, r) => s + (r.violation_count ?? 0), 0),
      scanned: pRows.reduce((s, r) => s + ((r.results as unknown[])?.length ?? 0), 0),
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
        {products.length > 0 && (
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : rows.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-gray-500">No scan data yet. Run a scan from the Dashboard.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Scans', value: rows.length, color: 'text-blue-600' },
              { label: 'Results Scanned', value: totalScanned, color: 'text-purple-600' },
              { label: 'Violations', value: totalViolations, color: 'text-red-600' },
              { label: 'Platforms', value: platforms.length, color: 'text-green-600' },
            ].map((s) => (
              <div key={s.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide">{s.label}</p>
                <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Platform Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-3 pr-6">Platform</th>
                    <th className="pb-3 pr-6">Scan Runs</th>
                    <th className="pb-3 pr-6">Results Scanned</th>
                    <th className="pb-3 pr-6">Violations</th>
                    <th className="pb-3">Violation Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {platformSummary.map((p) => (
                    <tr key={p.platform} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 pr-6">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${PLATFORM_COLORS[p.platform] ?? 'bg-gray-100 text-gray-700'}`}>{p.platform}</span>
                      </td>
                      <td className="py-3 pr-6 text-gray-700 dark:text-gray-300">{p.scans}</td>
                      <td className="py-3 pr-6 text-gray-700 dark:text-gray-300">{p.scanned}</td>
                      <td className="py-3 pr-6 font-semibold text-red-600">{p.violations}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: `${p.scanned > 0 ? Math.min(100, (p.violations / p.scanned) * 100) : 0}%` }} />
                          </div>
                          <span className="text-xs text-gray-500">{p.scanned > 0 ? ((p.violations / p.scanned) * 100).toFixed(1) : 0}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Scan History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-3 pr-4">Time</th>
                    <th className="pb-3 pr-4">Platform</th>
                    <th className="pb-3 pr-4">Query</th>
                    <th className="pb-3 pr-4">Scanned</th>
                    <th className="pb-3 pr-4">Violations</th>
                    <th className="pb-3">Triggered By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {rows.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-2 pr-4 text-gray-500 text-xs whitespace-nowrap">{new Date(r.completed_at).toLocaleString('id-ID')}</td>
                      <td className="py-2 pr-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${PLATFORM_COLORS[r.platform] ?? 'bg-gray-100 text-gray-700'}`}>{r.platform}</span>
                      </td>
                      <td className="py-2 pr-4 text-gray-700 dark:text-gray-300">{r.search_query}</td>
                      <td className="py-2 pr-4 text-gray-600 dark:text-gray-400">{(r.results as unknown[])?.length ?? 0}</td>
                      <td className="py-2 pr-4">
                        <span className={r.violation_count > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}>{r.violation_count}</span>
                      </td>
                      <td className="py-2 text-xs text-gray-400">{r.triggered_by ?? 'manual'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
