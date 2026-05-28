export interface DashboardStat {
  label: string
  value: string | number
  change: string
  iconName: string
  color: string
}
export interface Violation {
  id: string
  domain: string
  similarity: number
  status: string
  detected: string
}
export interface Activity {
  id: string
  type: string
  description: string
  time: string
  user: string
}
export interface Alert {
  id: string
  type: 'critical' | 'warning' | 'info'
  title: string
  description: string
  time: string
}
export interface DashboardData {
  stats: DashboardStat[]
  violations: Violation[]
  activities: Activity[]
  alerts: Alert[]
}