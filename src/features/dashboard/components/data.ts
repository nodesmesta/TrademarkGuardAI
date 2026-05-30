import { DashboardData, StatItem, Violation, ActivityItem, Alert } from './types';

export const statsData: StatItem[] = [
  { label: 'Total Products', value: '2,847', change: '+12%', changeType: 'increase', icon: 'products' },
  { label: 'Total Scans', value: '15,432', change: '+24%', changeType: 'increase', icon: 'scan' },
  { label: 'Reports Sent', value: '1,234', change: '+8%', changeType: 'increase', icon: 'email' },
  { label: 'Violations', value: '89', change: '-15%', changeType: 'decrease', icon: 'illegal' },
];

export const violationsData: Violation[] = [
  { id: 1, domain: 'fake-nike-store.com', brand: 'Nike', severity: 'high', type: 'Counterfeit', detected: '2 hours ago', status: 'active', confidence: 94 },
  { id: 2, domain: 'adidas-replica.id', brand: 'Adidas', severity: 'critical', type: 'Trademark', detected: '4 hours ago', status: 'investigating', confidence: 97 },
  { id: 3, domain: 'puma-fake.shop', brand: 'Puma', severity: 'medium', type: 'Design', detected: '1 day ago', status: 'active', confidence: 82 },
  { id: 4, domain: 'chanel-counterfeit.store', brand: 'Chanel', severity: 'high', type: 'Copyright', detected: '2 days ago', status: 'active', confidence: 91 },
  { id: 5, domain: 'apple-fake.net', brand: 'Apple', severity: 'low', type: 'Design', detected: '3 days ago', status: 'dismissed', confidence: 62 },
];

export const activitiesData: ActivityItem[] = [
  { id: 1, action: 'Violation detected', user: 'System', target: 'fake-nike-store.com', timestamp: '2 hours ago', type: 'warning' },
  { id: 2, action: 'Scan completed', user: 'System', target: '1,234 products', timestamp: '3 hours ago', type: 'success' },
  { id: 3, action: 'Report sent', user: 'Admin', target: 'violation@fake-shop.com', timestamp: '5 hours ago', type: 'info' },
  { id: 4, action: 'Monthly report generated', user: 'System', target: 'Dashboard Analytics', timestamp: '1 day ago', type: 'success' },
  { id: 5, action: 'New product added', user: 'User', target: '50 products', timestamp: '2 days ago', type: 'info' },
];

export const alertsData: Alert[] = [
  { id: 1, title: 'Critical: Multiple Nike violations detected', description: '3 new counterfeit websites detected in the last hour targeting Nike trademark', priority: 'critical', timestamp: '45 minutes ago', actionRequired: true },
  { id: 2, title: 'High: API connection unstable', description: 'Bright Data API experiencing intermittent connectivity issues', priority: 'high', timestamp: '2 hours ago', actionRequired: false },
  { id: 3, title: 'Medium: Storage usage near limit', description: 'Data storage at 85% capacity, consider upgrading', priority: 'medium', timestamp: '1 day ago', actionRequired: true },
];

export const chartData = [
  { name: 'Violations', data: [{ label: 'Mon', value: 12 }, { label: 'Tue', value: 19 }, { label: 'Wed', value: 15 }, { label: 'Thu', value: 25 }, { label: 'Fri', value: 22 }, { label: 'Sat', value: 18 }, { label: 'Sun', value: 14 }], color: 'danger' },
  { name: 'Scans', data: [{ label: 'Mon', value: 1200 }, { label: 'Tue', value: 1500 }, { label: 'Wed', value: 1800 }, { label: 'Thu', value: 2200 }, { label: 'Fri', value: 2500 }, { label: 'Sat', value: 2100 }, { label: 'Sun', value: 1900 }], color: 'primary' },
];

export const dashboardData: DashboardData = { stats: statsData, violations: [], activities: [], alerts: [], chartData };
export default dashboardData;
