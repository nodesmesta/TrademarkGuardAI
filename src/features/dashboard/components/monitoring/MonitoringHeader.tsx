import React from 'react';

interface HeaderProps {
  totalProducts: number;
  totalScans: number;
  totalViolations: number;
}

export default function MonitoringHeader({ totalProducts, totalScans, totalViolations }: HeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Monitoring Summary</h2>
      <p className="text-gray-600 dark:text-gray-400">
        {totalProducts} products monitored · {totalScans} scans completed · {totalViolations} violations detected
      </p>
    </div>
  );
}
