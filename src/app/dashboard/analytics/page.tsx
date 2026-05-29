"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface ScanResult {
  success: boolean;
  violations?: number;
  scanned?: number;
  error?: string;
  // other fields from API response
}

export default function Analytics() {
  const searchParams = useSearchParams();
  const productId = searchParams?.get('product');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }
    // First try local storage (set by dashboard after scan)
    const stored = localStorage.getItem(`scanResult_${productId}`);
    if (stored) {
      setResult(JSON.parse(stored));
      setLoading(false);
    } else {
      // Fallback: fetch from API (GET maybe not defined, but we can POST to trigger new scan?)
      // Here we just set loading false with null result.
      setLoading(false);
    }
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
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics – Produk {productId}</h1>
      {loading ? (
        <p className="mt-4 text-gray-600 dark:text-gray-400">Memuat hasil scan…</p>
      ) : result ? (
        <div className="mt-4 space-y-4">
          {result.success ? (
            <div>
              <p className="text-gray-600 dark:text-gray-400">
                Ditemukan {result.violations ?? 0} pelanggaran pada {result.scanned ?? 0} hasil yang dipindai.
              </p>
            </div>
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
