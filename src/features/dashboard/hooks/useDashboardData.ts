"use client";
import { useState, useEffect, useCallback } from 'react';

interface Stat {
  label: string;
  value: string;
  change?: string;
  changeType?: string;
  icon?: string;
}

interface Violation {
  id: string;
  brand: string;
  domain: string;
  description: string;
  detected: string;
  status: string;
  confidence: number;
  url: string;
  title: string;
  platform: string;
  seller: string;
}

interface Activity {
  id: string;
  action: string;
  user: string;
  target: string;
  timestamp: string;
  type: string;
}

interface Alert {
  id: string;
  title: string;
  description: string;
  priority: string;
  timestamp: string;
  actionRequired: boolean;
}

interface DashboardData {
  stats: Stat[];
  violations: Violation[];
  activities: Activity[];
  alerts: Alert[];
  user?: { id: string; email: string; name?: string };
  source?: string;
  timestamp?: string;
}

/**
 * Hook to fetch the full dashboard payload.
 * Returns the data object, loading flag, and any error.
 */
export default function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = '';
      const res = await fetch('/api/dashboard/data', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data as DashboardData);
      } else {
        setData(null);
        setError(json.error ?? 'Unknown error');
      }
    } catch (e) {
      setError((e as Error).message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error };
}
