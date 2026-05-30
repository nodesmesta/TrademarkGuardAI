"use client"
import React, { useEffect, useState } from 'react'

interface Product { id: string; name: string; description?: string; keywords: string[]; platforms: string[]; active: boolean }

const ALL_PLATFORMS = ['amazon', 'google', 'instagram', 'tiktok', 'x']

export default function SettingsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({ name: '', description: '', keywords: '', platforms: ['amazon', 'google'] })
  const [token, setToken] = useState('')

  useEffect(() => { setToken(localStorage.getItem('token') ?? '') }, [])

  const fetchProducts = () => {
    const t = localStorage.getItem('token') ?? ''
    fetch('/api/products', { credentials: 'include', headers: { Authorization: `Bearer ${t}` } })
      .then((r) => r.json())
      .then((d) => { if (d.success) setProducts(d.products) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setMsg('')
    const res = await fetch('/api/products', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean),
        platforms: form.platforms,
      }),
    })
    const d = await res.json()
    if (d.success) {
      setMsg('Product added successfully.')
      setForm({ name: '', description: '', keywords: '', platforms: ['amazon', 'google'] })
      fetchProducts()
    } else {
      setMsg(d.error ?? 'Failed to add product.')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    await fetch('/api/products', {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    })
    fetchProducts()
  }

  const togglePlatform = (p: string) => {
    setForm((f) => ({ ...f, platforms: f.platforms.includes(p) ? f.platforms.filter((x) => x !== p) : [...f.platforms, p] }))
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add Product to Monitor</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product / Brand Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Nike"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keywords (comma separated)</label>
            <input
              value={form.keywords}
              onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))}
              className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="nike, nike shoes, nike air max"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Platforms to Monitor</label>
            <div className="flex flex-wrap gap-2">
              {ALL_PLATFORMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    form.platforms.includes(p)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          {msg && <p className={`text-sm ${msg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Add Product'}
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Registered Products</h2>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500 text-sm">No products yet.</p>
        ) : (
          <ul className="space-y-3">
            {products.map((p) => (
              <li key={p.id} className="flex items-start justify-between gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white">{p.name}</p>
                  {p.description && <p className="text-xs text-gray-500 mt-0.5">{p.description}</p>}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.keywords.map((k) => (
                      <span key={k} className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded text-xs">{k}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.platforms.map((pl) => (
                      <span key={pl} className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded text-xs">{pl}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => handleDelete(p.id)} className="text-xs text-red-500 hover:text-red-700 shrink-0 mt-1">Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
