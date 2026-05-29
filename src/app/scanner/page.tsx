"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/features/ui/button';

function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-3', lg: 'w-12 h-12 border-4' };
  return (
    <div
      className={`inline-block animate-spin rounded-full border-blue-600 border-t-transparent ${sizeClasses[size]}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default function ScannerPage() {
  const router = useRouter();
  const [productId, setProductId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [details, setDetails] = useState<Array<{title?: string; url?: string; seller?: string}>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setProductId(params.get('id'));
    }
  }, []);

  useEffect(() => {
    if (!productId) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') ?? '' : '';
    if (!token) {
      setStatus('Authentication required');
      return;
    }
    const runScan = async () => {
      setLoading(true);
      setStatus('Scanning');
        const res = await fetch(`/api/products/${productId}/scan`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setStatus(
            `Done  ${data.violations} violation(s) found, ${data.scanned} results scanned. Email report sent.`
          );
          const violations = (data.results ?? []).flatMap((r: any) => r.violations || []);
          setDetails(violations);
        } else {
          setStatus(`Error: ${data.error}`);
        }
        setLoading(false);
    };
    runScan();
  }, [productId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Product Scan</h1>
      {loading && <Spinner size="lg" />}
      {status && <p className="text-center text-gray-800 dark:text-gray-200 mb-4">{status}</p>}
      <Button variant="ghost" onClick={() => router.push('/dashboard')}>
         Back to Dashboard
      </Button>
    </div>
  );
}
