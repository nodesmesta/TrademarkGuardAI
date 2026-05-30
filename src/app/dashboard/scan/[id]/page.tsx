"use client"
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ScanLine, CheckCircle2, Globe, AlertTriangle } from 'lucide-react'

interface ScanResult {
  platform: string
  violation_count: number
  results: unknown[]
  completed_at: string
}

export default function ScanProgressPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [results, setResults] = useState<ScanResult[]>([])
  const [productName, setProductName] = useState('')
  const [done, setDone] = useState(false)
  const prevCount = useRef(0)
  const stableCount = useRef(0)

  useEffect(() => {
    if (!id) return
    let active = true
    const token = localStorage.getItem('token') ?? ''
    const headers = { Authorization: `Bearer ${token}` }

    // Fetch product name
    fetch('/api/products', { credentials: 'include', headers })
      .then(r => r.json())
      .then(d => {
        const p = d.products?.find((p: { id: string; name: string }) => p.id === id)
        if (p) setProductName(p.name)
      })

    const poll = async () => {
      const res = await fetch(`/api/products/${id}/monitoring-results`, { credentials: 'include', headers })
      const data = await res.json()
      if (!active) return
      const rows = data.monitoringResults ?? []
      setResults(rows)

      // Detect scan complete: results count stable for 2 consecutive polls
      if (rows.length > 0 && rows.length === prevCount.current) {
        stableCount.current++
      } else {
        stableCount.current = 0
      }
      prevCount.current = rows.length

      if (stableCount.current >= 2) {
        setDone(true)
        router.push(`/dashboard/analytics?product=${id}`)
      }
    }

    poll()
    const interval = setInterval(poll, 4000)
    return () => { active = false; clearInterval(interval) }
  }, [id, router])

  const totalScanned = results.reduce((s, r) => s + ((r.results as unknown[])?.length ?? 0), 0)
  const totalViolations = results.reduce((s, r) => s + (r.violation_count ?? 0), 0)
  const platforms = [...new Set(results.map(r => r.platform))]

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-lg text-center space-y-6">
        {/* Icon */}
        <div className="relative mx-auto w-20 h-20">
          {done ? (
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          ) : (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900" />
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ScanLine className="w-8 h-8 text-blue-600" />
              </div>
            </>
          )}
        </div>

        {/* Status text */}
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {done ? 'Scan Complete!' : 'Scanning in Progress...'}
          </h1>
          {productName && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {done ? 'Redirecting to analytics...' : `Monitoring "${productName}" across platforms`}
            </p>
          )}
        </div>

        {/* Live stats */}
        {results.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
              <Globe className="w-4 h-4 text-blue-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{platforms.length}</p>
              <p className="text-xs text-gray-500">Platforms</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
              <ScanLine className="w-4 h-4 text-purple-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{totalScanned}</p>
              <p className="text-xs text-gray-500">Scanned</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
              <AlertTriangle className="w-4 h-4 text-red-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-red-600">{totalViolations}</p>
              <p className="text-xs text-gray-500">Violations</p>
            </div>
          </div>
        )}

        {/* Platform progress feed */}
        {results.length > 0 && (
          <div className="text-left space-y-2 max-h-48 overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <span className="font-medium capitalize text-gray-700 dark:text-gray-300">{r.platform}</span>
                <span className="text-gray-400 text-xs ml-auto">
                  {(r.results as unknown[])?.length ?? 0} results · {r.violation_count} violations
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Waiting indicator */}
        {!done && results.length === 0 && (
          <p className="text-sm text-gray-400 animate-pulse">Waiting for scan results...</p>
        )}
      </div>
    </div>
  )
}
