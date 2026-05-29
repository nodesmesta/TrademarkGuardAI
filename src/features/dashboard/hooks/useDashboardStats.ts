"use client";
import { useState, useEffect, useCallback } from 'react';

interface Stat {
  label: string;
  value: string;
  change?: string;
  changeType?: string;
  icon?: string;
}

/**
 * Hook to fetch dashboard stats from the API.
 * Returns the stats array, a loading flag, and any error encountered.
 */
export default function useDashboardStats() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch without explicit token; rely on cookie authentication
      const res = await fetch('/api/dashboard/data');
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json = await res.json();
      if (json.success && json.data) {
        setStats(json.data.stats || []);
      } else {
        setStats([]);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return { stats, loading, error };
}
