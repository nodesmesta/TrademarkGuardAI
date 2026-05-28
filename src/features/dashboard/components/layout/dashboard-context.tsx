'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'
import { DashboardConfig, DashboardUser, DashboardTrademark, DEFAULT_DASHBOARD_CONFIG } from './types'
interface DashboardContextType {
  config: DashboardConfig
  setConfig: (config: DashboardConfig) => void
  user: DashboardUser | null
  setUser: (user: DashboardUser) => void
  trademarks: DashboardTrademark[]
  setTrademarks: (trademarks: DashboardTrademark[]) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}
const DashboardContext = createContext<DashboardContextType | undefined>(undefined)
interface DashboardProviderProps {
  children: ReactNode
  initialConfig?: DashboardConfig
  initialUser?: DashboardUser | null
  initialTrademarks?: DashboardTrademark[]
}
export function DashboardProvider({
  children,
  initialConfig = DEFAULT_DASHBOARD_CONFIG,
  initialUser = null,
  initialTrademarks = []
}: DashboardProviderProps) {
  const [config, setConfig] = useState<DashboardConfig>(initialConfig)
  const [user, setUser] = useState<DashboardUser | null>(initialUser)
  const [trademarks, setTrademarks] = useState<DashboardTrademark[]>(initialTrademarks)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const value: DashboardContextType = {
    config,
    setConfig,
    user,
    setUser,
    trademarks,
    setTrademarks,
    sidebarOpen,
    setSidebarOpen
  }
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}
export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
