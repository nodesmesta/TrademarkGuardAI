import { DashboardData, StatItem, Violation, ActivityItem, Alert } from './types';

export const statsData: StatItem[] = [
  { label: 'Total Produk', value: '2,847', change: '+12%', changeType: 'increase', icon: 'products' },
  { label: 'Total Scan', value: '15,432', change: '+24%', changeType: 'increase', icon: 'scan' },
  { label: 'Email Dilaporkan', value: '1,234', change: '+8%', changeType: 'increase', icon: 'email' },
  { label: 'Illegal Produk', value: '89', change: '-15%', changeType: 'decrease', icon: 'illegal' },
];

export const violationsData: Violation[] = [
  {
    id: 1,
    domain: 'fake-nike-store.com',
    brand: 'Nike',
    severity: 'high',
    type: 'Counterfeit',
    detected: '2 jam yang lalu',
    status: 'active',
    confidence: 94
  },
  {
    id: 2,
    domain: 'adidas-replica.id',
    brand: 'Adidas',
    severity: 'critical',
    type: 'Trademark',
    detected: '4 jam yang lalu',
    status: 'investigating',
    confidence: 97
  },
  {
    id: 3,
    domain: 'puma-fake.shop',
    brand: 'Puma',
    severity: 'medium',
    type: 'Design',
    detected: '1 hari yang lalu',
    status: 'active',
    confidence: 82
  },
  {
    id: 4,
    domain: 'chanel-counterfeit.store',
    brand: 'Chanel',
    severity: 'high',
    type: 'Copyright',
    detected: '2 hari yang lalu',
    status: 'active',
    confidence: 91
  },
  {
    id: 5,
    domain: 'apple-fake.net',
    brand: 'Apple',
    severity: 'low',
    type: 'Design',
    detected: '3 hari yang lalu',
    status: 'dismissed',
    confidence: 62
  }
];

export const activitiesData: ActivityItem[] = [
  {
    id: 1,
    action: 'Produk illegal terdeteksi',
    user: 'System',
    target: 'fake-nike-store.com',
    timestamp: '2 jam yang lalu',
    type: 'warning'
  },
  {
    id: 2,
    action: 'Scan selesai',
    user: 'System',
    target: '1,234 produk',
    timestamp: '3 jam yang lalu',
    type: 'success'
  },
  {
    id: 3,
    action: 'Email dilaporkan',
    user: 'Admin',
    target: 'violation@fake-shop.com',
    timestamp: '5 jam yang lalu',
    type: 'info'
  },
  {
    id: 4,
    action: 'Laporan bulanan dibuat',
    user: 'System',
    target: 'Dashboard Analytics',
    timestamp: '1 hari yang lalu',
    type: 'success'
  },
  {
    id: 5,
    action: 'Produk baru ditambahkan',
    user: 'User',
    target: '50 produk',
    timestamp: '2 hari yang lalu',
    type: 'info'
  }
];

export const alertsData: Alert[] = [
  {
    id: 1,
    title: 'Kritis: Multiple pelanggaran Nike terdeteksi',
    description: '3 website palsu baru terdeteksi dalam 1 jam terakhir yang menargetkan trademark Nike',
    priority: 'critical',
    timestamp: '45 menit yang lalu',
    actionRequired: true
  },
  {
    id: 2,
    title: 'Tinggi: API connection tidak stabil',
    description: 'Bright Data API mengalami masalah konektivitas intermittent',
    priority: 'high',
    timestamp: '2 jam yang lalu',
    actionRequired: false
  },
  {
    id: 3,
    title: 'Sedang: Penggunaan storage mendekati limit',
    description: 'Penyimpanan data mencapai 85% kapasitas, pertimbangkan upgrade',
    priority: 'medium',
    timestamp: '1 hari yang lalu',
    actionRequired: true
  }
];

export const chartData = [
  {
    name: 'Produk Illegal',
    data: [
      { label: 'Sen', value: 12 },
      { label: 'Sel', value: 19 },
      { label: 'Rab', value: 15 },
      { label: 'Kam', value: 25 },
      { label: 'Jum', value: 22 },
      { label: 'Sab', value: 18 },
      { label: 'Min', value: 14 }
    ],
    color: 'danger'
  },
  {
    name: 'Scan Dilakukan',
    data: [
      { label: 'Sen', value: 1200 },
      { label: 'Sel', value: 1500 },
      { label: 'Rab', value: 1800 },
      { label: 'Kam', value: 2200 },
      { label: 'Jum', value: 2500 },
      { label: 'Sab', value: 2100 },
      { label: 'Min', value: 1900 }
    ],
    color: 'primary'
  }
];

export const dashboardData: DashboardData = {
  stats: statsData,
  violations: [],
  activities: [],
  alerts: [],
  chartData: chartData
};

export default dashboardData;
