export interface DashboardNavItem {
  id: string
  label: string
  href: string
  icon?: React.ComponentType
  active?: boolean
  badge?: number | string
  children?: DashboardNavItem[]
}
export interface DashboardConfig {
  showSidebar: boolean
  sidebarWidth: number | string
  headerType: 'default' | 'minimal' | 'none'
  maxWidth: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding: boolean
}
export interface DashboardUser {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}
export interface DashboardTrademark {
  id: string
  name: string
  violations: number
  status: 'active' | 'warning' | 'critical'
  lastScanned?: string
}
export const DEFAULT_DASHBOARD_CONFIG: DashboardConfig = {
  showSidebar: true,
  sidebarWidth: 'var(--width-sidebar)',
  headerType: 'default',
  maxWidth: 'full',
  padding: false
}
export const DEFAULT_DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { id: 'overview', label: 'Overview', href: '/dashboard', active: true },
  { id: 'monitoring', label: 'Monitoring', href: '/dashboard/monitoring', badge: 3 },
  { id: 'analytics', label: 'Analytics', href: '/dashboard/analytics' },
  { id: 'alerts', label: 'Alerts', href: '/dashboard/alerts', badge: 12 },
  { id: 'compliance', label: 'Compliance', href: '/dashboard/compliance' },
]
export const DEFAULT_DASHBOARD_TRADEMARKS: DashboardTrademark[] = [
  { id: '1', name: 'Claude AI', violations: 2, status: 'active' },
  { id: '2', name: 'Next.js', violations: 0, status: 'active' },
  { id: '3', name: 'React', violations: 1, status: 'warning' },
  { id: '4', name: 'Vercel', violations: 0, status: 'active' },
  { id: '5', name: 'OpenAI', violations: 5, status: 'critical' },
]
