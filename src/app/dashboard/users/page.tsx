'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { ProtectedLayout } from '@/features/auth/components/protected-layout'
import { Users, Mail, Calendar, Shield, Search } from 'lucide-react'

interface UserData { id: string; email: string; name?: string; created_at: string; role?: string }

function UsersContent() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    const token = localStorage.getItem('token') ?? ''
    const res = await fetch('/api/auth/status', { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    if (data.user) {
      setUsers([{
        id: data.user.id || '1',
        email: data.user.email,
        name: data.user.name || data.user.email?.split('@')[0],
        created_at: data.user.created_at || new Date().toISOString(),
        role: 'admin',
      }])
    } else {
      setUsers([])
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const filtered = users.filter(
    (u) => u.email.toLowerCase().includes(search.toLowerCase()) || (u.name ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users Data</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and view registered users</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50">
          <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-400">{users.length} users</span>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <th className="text-left px-6 py-3 font-semibold text-gray-600 dark:text-gray-400">User</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600 dark:text-gray-400">Email</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600 dark:text-gray-400">Role</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600 dark:text-gray-400">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No users found.</td></tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{user.name || user.email.split('@')[0]}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Mail className="w-3.5 h-3.5" />{user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50">
                        <Shield className="w-3 h-3" />{user.role || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function UsersPage() {
  return (
    <ProtectedLayout>
      <UsersContent />
    </ProtectedLayout>
  )
}
