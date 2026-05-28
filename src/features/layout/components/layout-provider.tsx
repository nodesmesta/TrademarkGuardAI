'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'
import {
  LayoutContextType,
  LayoutConfig,
  NavbarProps,
  FooterProps,
  DEFAULT_LAYOUT
} from '../types/index'
const DEFAULT_NAVBAR: NavbarProps = {
  variant: 'default',
  showAuth: true,
  showLogo: true
}
const DEFAULT_FOOTER: FooterProps = {
  variant: 'default',
  showLinks: true,
  showSocial: true
}
const LayoutContext = createContext<LayoutContextType | undefined>(undefined)
interface LayoutProviderProps {
  children: ReactNode
  initialLayout?: LayoutConfig
  initialNavbar?: NavbarProps
  initialFooter?: FooterProps
}
export function LayoutProvider({
  children,
  initialLayout = DEFAULT_LAYOUT,
  initialNavbar = DEFAULT_NAVBAR,
  initialFooter = DEFAULT_FOOTER
}: LayoutProviderProps) {
  const [layout, setLayout] = useState<LayoutConfig>(initialLayout)
  const [navbar, setNavbar] = useState<NavbarProps>(initialNavbar)
  const [footer, setFooter] = useState<FooterProps>(initialFooter)
  const value: LayoutContextType = {
    layout,
    setLayout,
    navbar,
    setNavbar,
    footer,
    setFooter
  }
  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  )
}
export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}