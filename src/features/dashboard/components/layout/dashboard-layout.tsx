'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/features/ui/button'
import { cn } from '@/features/ui'
import { useAuth } from '@/contexts/auth-context'
import { 
  Shield, Search, AlertTriangle, Users,
  Settings, Menu, X, Bell, LogOut, User, ChevronDown, Home, FileText, BarChart3, Bot
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

export default function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20
      setScrolled(isScrolled)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const pathname = usePathname()

  const navItems = [
    // active flag will be set dynamically below
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard', badge: undefined },
    { id: 'monitoring', label: 'Monitoring', icon: Search, href: '/dashboard/monitoring', badge: 5 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/dashboard/analytics', badge: undefined },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, href: '/dashboard/alerts', badge: 12 },
    { id: 'reports', label: 'Reports', icon: FileText, href: '/dashboard/reports', badge: undefined },
    { id: 'users', label: 'Users Data', icon: Users, href: '/dashboard/users', badge: undefined },
    { id: 'ai-chat', label: 'AI Chat', icon: Bot, href: '/dashboard/ai-chat', badge: undefined },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings', badge: undefined },
  ]

  const navItemsWithActive = navItems.map(item => ({
    ...item,
    active: item.href === pathname,
  }));

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
  }

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950", className)}>
      
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:bg-white dark:hover:bg-gray-800"
        >
          {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl",
        "border-r border-gray-200/50 dark:border-gray-800/50 shadow-xl",
        "transition-all duration-300 ease-out z-50",
        "lg:z-40",
        sidebarOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full lg:w-20 lg:translate-x-0",
        mobileSidebarOpen ? "translate-x-0 w-72" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-50"></div>
                <div className="relative w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className={cn("transition-opacity duration-300", sidebarOpen ? "opacity-100" : "opacity-0 lg:hidden")}>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TradeGuard AI
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Trademark Protection</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navItemsWithActive.map((item) => (
                <li key={item.id}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-12 px-3 rounded-xl transition-all duration-200",
                      "hover:bg-blue-50/50 dark:hover:bg-blue-900/20 hover:shadow-sm",
                      item.active 
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200/50 dark:border-blue-800/50" 
                        : "text-gray-700 dark:text-gray-300"
                    )}
                    onClick={() => console.log(`Navigate to ${item.id}`)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <item.icon className={cn("w-5 h-5 transition-colors", item.active ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400")} />
                      <span className={cn("font-medium transition-opacity duration-300", sidebarOpen ? "opacity-100" : "opacity-0 lg:hidden")}>
                        {item.label}
                      </span>
                    </div>
                    {item.badge !== undefined && sidebarOpen && (
                      <span className="ml-auto bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2.5 py-1 rounded-full shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          {/* User profile */}
          <div className="p-4 border-t border-gray-200/50 dark:border-gray-800/50">
            <div className="relative">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-12 px-3 rounded-xl transition-all duration-200",
                  "hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                )}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-sm opacity-50"></div>
                    <div className="relative w-9 h-9 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                      {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div className={cn("flex-1 text-left transition-opacity duration-300", sidebarOpen ? "opacity-100" : "opacity-0 lg:hidden")}>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {user?.name || user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.email || 'Loading...'}
                    </p>
                  </div>
                  {sidebarOpen && (
                    <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-200", userMenuOpen ? "rotate-180" : "")} />
                  )}
                </div>
              </Button>

              {/* Dropdown menu */}
              {userMenuOpen && (
                <div className={cn(
                  "absolute bottom-full left-0 right-0 mb-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl",
                  "rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 z-50",
                  "animate-in slide-in-from-bottom-2 duration-200",
                  sidebarOpen ? "w-full" : "left-1/2 -translate-x-1/2 w-48"
                )}>
                  <div className="py-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-4 py-2.5 text-sm hover:bg-blue-50/50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300"
                      onClick={() => {
                        console.log('Navigate to profile')
                        setUserMenuOpen(false)
                      }}
                    >
                      <User className="w-4 h-4 mr-3 text-gray-500" />
                      Profile Settings
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn(
        "transition-all duration-300 ease-out",
        "lg:ml-72",
        !sidebarOpen && "lg:ml-20"
      )}>
        {/* Top navbar */}
        <div className={cn(
          "sticky top-0 z-30 backdrop-blur-xl transition-all duration-300",
          scrolled 
            ? "bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm" 
            : "bg-transparent border-b border-transparent"
        )}>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.name || user?.email?.split('@')[0] || 'User'}!
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                Here's what's happening with your trademarks today
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="relative p-2.5 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white dark:border-gray-900"></span>
              </Button>
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50/50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-700 dark:text-green-400">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
