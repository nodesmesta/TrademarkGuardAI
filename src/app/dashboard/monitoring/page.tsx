"use client";
import React, { useEffect, useState } from 'react';
import MonitoringHeader from '@/features/dashboard/components/monitoring/MonitoringHeader';
import ViolationTrendChart from '@/features/dashboard/components/monitoring/ViolationTrendChart';
import RecentScansTable from '@/features/dashboard/components/monitoring/RecentScansTable';

interface Stat {
  label: string;
  value: string;
  change: string;
  changeType: string;
  icon: string;
}

interface ScanItem {
  id: string;
  action: string;
  user: string;
  target: string;
  timestamp: string;
  type: string;
}

export default function Monitoring() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [scans, setScans] = useState<ScanItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch('/api/dashboard/data');
        if (!res.ok) {
          console.error('Failed to fetch monitoring data', res.status);
          return;
        }
        const json = await res.json();
        if (json.success) {
          const data = json.data;
          setStats(data.stats || []);
          setScans(data.activities || []);
        } else {
          console.warn('Dashboard API error', json);
        }
      } catch (e) {
        console.error('Error fetching monitoring data', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalProducts = stats.find(s => s.label === 'Total Produk')?.value || '0';
  const totalScans = stats.find(s => s.label === 'Total Scan')?.value || '0';
  const totalViolations = stats.find(s => s.label === 'Illegal Produk')?.value || '0';

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Monitoring</h1>
      {loading ? (
        <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
      ) : (
        <>
          <MonitoringHeader
            totalProducts={parseInt(totalProducts, 10)}
            totalScans={parseInt(totalScans, 10)}
            totalViolations={parseInt(totalViolations, 10)}
          />
          <ViolationTrendChart stats={stats} />
          <RecentScansTable scans={scans} />
        </>
      )}
    </div>
  );
}
