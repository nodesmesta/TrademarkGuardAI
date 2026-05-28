'use client'
import Link from 'next/link'
import { Menu, X, Shield, ArrowRight, Search, User, LogOut, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/features/ui'
import { Button } from '@/features/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { NavbarProps, NavItem } from '../../types'
interface ModularNavbarProps extends NavbarProps {
  className?: string
  items?: NavItem[]
  onItemClick?: (item: NavItem) => void
}
const defaultItems: NavItem[] = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Use Cases', href: '#use-cases' },
  { label: 'Pricing', href: '#pricing' },
]
export function ModularNavbar({
  variant = 'default',
  showAuth = true,
  showLogo = true,
  className,
  items = defaultItems,
  onItemClick
}: ModularNavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrolled])
  const renderDefaultNavbar = () => (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4',
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {showLogo && (
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              TradeGuard AI
            </Link>
          )}
          <div className="hidden md:flex items-center space-x-6">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onItemClick?.(item)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          {showAuth && (
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user.name || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            logout()
                            setUserMenuOpen(false)
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/signin" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    Sign In
                  </Link>
                  <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
  const renderTransparentNavbar = () => (
    <nav className={cn(
      `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled 
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg border-b border-gray-200/30 dark:border-gray-700/30 py-3' 
        : 'bg-transparent py-5'}`,
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {showLogo && (
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className={`absolute inset-0 rounded-xl blur transition-opacity duration-500 ${
                    scrolled 
                      ? 'bg-gradient-to-br from-blue-500/40 to-purple-600/40 opacity-80' 
                      : 'bg-gradient-to-br from-blue-500 to-purple-600 opacity-70 group-hover:opacity:100'
                  }`}></div>
                  <div className={`relative flex items-center justify-center transition-all duration-500 ${
                    scrolled 
                      ? 'w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg shadow-md' 
                      : 'w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl shadow-lg group-hover:shadow-xl'
                  }`}>
                    <Shield className={`transition-all duration-500 ${
                      scrolled ? 'w-5 h-5' : 'w-6 h-6'
                    } text-white`} />
                  </div>
                </div>
                <div className="flex flex-col transition-all duration-500">
                  <span className={`font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition-all duration-500 ${
                    scrolled ? 'text-lg' : 'text-xl'
                  }`}>
                    TradeGuard AI
                  </span>
                  <span className={`font-medium transition-all duration-500 ${
                    scrolled ? 'text-xs opacity-70' : 'text-xs opacity-100'
                  } text-gray-500 dark:text-gray-400`}>
                    Trademark Protection Platform
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className="hidden lg:flex items-center space-x-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onItemClick?.(item)}
                className={`group flex items-center px-4 py-2.5 rounded-lg transition-all duration-300 ${
                  scrolled
                    ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-gray-800/50 text-sm font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-gray-800/50 font-medium'
                }`}
              >
                <span>{item.label}</span>
                <span className={`ml-2 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-300 ${
                  scrolled ? 'w-0 group-hover:w-3' : 'w-0 group-hover:w-4'
                } opacity-0 group-hover:opacity-100`}></span>
              </Link>
            ))}
          </div>
          {showAuth && (
            <div className="hidden lg:flex items-center space-x-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      scrolled
                        ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-gray-800/50 text-sm font-medium border border-gray-300 dark:border-gray-700'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-gray-800/50 font-medium border border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="font-medium">
                      {user.name || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            logout()
                            setUserMenuOpen(false)
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    className={`text-gray-600 hover:text-blue-600 font-medium transition-all duration-300 px-4 py-2 rounded-lg hover:bg-blue-50/50 ${
                      scrolled ? 'text-sm' : ''
                    }`}
                  >
                    Search Demo
                  </button>
                  <Link
                    href="/signup"
                    className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 ${
                      scrolled ? 'px-5 py-2 text-sm' : 'px-6 py-2.5'
                    }`}
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          )}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                scrolled 
                  ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400' 
                  : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="lg:hidden mt-4 pb-4 animate-in slide-in-from-top-5 duration-200">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-4">
              <div className="space-y-1">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      setIsOpen(false)
                      onItemClick?.(item)
                    }}
                    className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <span className="font-medium">{item.label}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
              {showAuth && (
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  {user ? (
                    <>
                      <div className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                            {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{user.name || user.email?.split('@')[0]}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      <Link
                        href="/dashboard"
                        className="block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 text-center"
                        onClick={() => setIsOpen(false)}
                      >
                        Go to Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setIsOpen(false)
                        }}
                        className="w-full px-4 py-3 rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Search Demo
                      </button>
                      <Link
                        href="/signup"
                        className="block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 text-center"
                        onClick={() => setIsOpen(false)}
                      >
                        Get Started Free
                      </Link>
                      <Link
                        href="/signin"
                        className="block w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors text-center"
                        onClick={() => setIsOpen(false)}
                      >
                        Already have an account? Sign In
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {!scrolled && variant === 'transparent' && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-100 scale-100 transition-all duration-300"></div>
        </div>
      )}
    </nav>
  )
  const renderDashboardNavbar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    return (
      <header className={cn(
        "sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80",
        "border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm",
        className
      )}>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                aria-label="Toggle sidebar"
              >
                <div className="w-5 h-5 flex flex-col justify-center gap-1">
                  <div className="h-0.5 w-full bg-gray-700 dark:bg-gray-300 rounded-full" />
                  <div className="h-0.5 w-full bg-gray-700 dark:bg-gray-300 rounded-full" />
                  <div className="h-0.5 w-full bg-gray-700 dark:bg-gray-300 rounded-full" />
                </div>
              </button>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Real-time trademark monitoring
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2.5 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
                <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <Button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300">
                New Scan
              </Button>
            </div>
          </div>
        </div>
      </header>
    )
  }
  switch (variant) {
    case 'dashboard':
      return renderDashboardNavbar()
    case 'transparent':
      return renderTransparentNavbar()
    default:
      return renderDefaultNavbar()
  }
}