export type LayoutType = 'default' | 'dashboard' | 'auth' | 'minimal'
export interface LayoutConfig {
  type: LayoutType
  showNavbar?: boolean
  showFooter?: boolean
  showSidebar?: boolean
  headerType?: 'default' | 'dashboard' | 'none'
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: boolean
}
export interface NavbarProps {
  variant?: 'default' | 'transparent' | 'dashboard'
  showAuth?: boolean
  showLogo?: boolean
}
export interface FooterProps {
  variant?: 'default' | 'simple' | 'none'
  showLinks?: boolean
  showSocial?: boolean
}
export interface SidebarProps {
  variant?: 'dashboard' | 'settings' | 'admin'
  items?: NavItem[]
  user?: UserInfo
}
export interface NavItem {
  label: string
  href: string
  icon?: React.ComponentType
  active?: boolean
  badge?: number | string
  children?: NavItem[]
}
export interface UserInfo {
  name: string
  email: string
  role?: string
  avatar?: string
}
export interface LayoutContextType {
  layout: LayoutConfig
  setLayout: (config: LayoutConfig) => void
  navbar: NavbarProps
  setNavbar: (props: NavbarProps) => void
  footer: FooterProps
  setFooter: (props: FooterProps) => void
}
export const DEFAULT_LAYOUT: LayoutConfig = {
  type: 'default',
  showNavbar: true,
  showFooter: true,
  showSidebar: false,
  headerType: 'default',
  maxWidth: 'lg',
  padding: true
}
export const DASHBOARD_LAYOUT: LayoutConfig = {
  type: 'dashboard',
  showSidebar: true,
  headerType: 'dashboard',
  maxWidth: 'full',
  padding: false
}
export const AUTH_LAYOUT: LayoutConfig = {
  type: 'auth',
  showNavbar: false,
  showFooter: false,
  showSidebar: false,
  headerType: 'none',
  maxWidth: 'sm',
  padding: true
}
export const MINIMAL_LAYOUT: LayoutConfig = {
  type: 'minimal',
  showNavbar: false,
  showFooter: false,
  showSidebar: false,
  headerType: 'none',
  maxWidth: 'full',
  padding: false
}