"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface ScanResult {
  success: boolean;
  violations?: number;
  scanned?: number;
  error?: string;
}

export default function AnalyticsClient() {
  const searchParams = useSearchParams();
  const productId = searchParams?.get('product');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') ?? '' : '';
    fetch(`/api/products/${productId}/monitoring-results`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.monitoringResults) && data.monitoringResults.length) {
          const latest = data.monitoringResults[0];
          const violations = latest.violations?.length ?? 0;
          const scanned = latest.results?.length ?? 0;
          setResult({ success: true, violations, scanned });
        } else {
          setResult({ success: false, error: data.error ?? 'No scan data' });
        }
      })
      .catch((err) => setResult({ success: false, error: err.message }))
      .finally(() => setLoading(false));
  }, [productId]);

  if (!productId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Produk tidak dipilih. Jalankan scan dari Dashboard untuk melihat analitik.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics  Produk {productId}</h1>
      {loading ? (
        <p className="mt-4 text-gray-600 dark:text-gray-400">Memuat hasil scan</p>
      ) : result ? (
        <div className="mt-4 space-y-4">
          {result.success ? (
            <p className="text-gray-600 dark:text-gray-400">
              Ditemukan {result.violations ?? 0} pelanggaran pada {result.scanned ?? 0} hasil yang dipindai.
            </p>
          ) : (
            <p className="text-red-600 dark:text-red-400">Error: {result.error}</p>
          )}
        </div>
      ) : (
        <p className="mt-4 text-gray-600 dark:text-gray-400">Tidak ada data scan tersedia.</p>
      )}
    </div>
  );
}
