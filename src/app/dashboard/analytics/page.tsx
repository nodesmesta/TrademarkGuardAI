export const dynamic = 'force-dynamic';
import React, { Suspense } from 'react';
import AnalyticsClient from '@/app/dashboard/analytics/AnalyticsClient';

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div className="p-6"><p className="text-gray-600 dark:text-gray-400">Loading analytics</p></div>}>
      <AnalyticsClient />
    </Suspense>
  );
}
