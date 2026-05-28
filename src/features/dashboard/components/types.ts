export interface StatItem {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: 'products' | 'scan' | 'email' | 'illegal';
}
export interface Violation {
  id: number;
  domain: string;
  brand: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  detected: string;
  status: 'active' | 'investigating' | 'resolved' | 'dismissed';
  confidence: number;
}
export interface ActivityItem {
  id: number;
  action: string;
  user: string;
  target: string;
  timestamp: string;
  type: 'success' | 'error' | 'warning' | 'info';
}
export interface Alert {
  id: number;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  actionRequired: boolean;
}
export interface ChartDataPoint {
  label: string;
  value: number;
}
export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color: string;
}
export interface DashboardData {
  stats: StatItem[];
  violations: Violation[];
  activities: ActivityItem[];
  alerts: Alert[];
  chartData: ChartSeries[];
}