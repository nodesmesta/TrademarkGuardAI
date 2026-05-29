import React from 'react';

interface Stat {
  label: string;
  value: string;
  change: string;
  changeType: string;
  icon: string;
}

interface TrendProps {
  stats: Stat[];
}

export default function ViolationTrendChart({ stats }: TrendProps) {
  // Convert value strings to numbers for simple bar scaling (fallback to 0)
  const numericStats = stats.map(s => ({
    ...s,
    numeric: parseInt(s.value.replace(/[^0-9]/g, ''), 10) || 0,
  }));
  const max = Math.max(...numericStats.map(s => s.numeric), 1);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Statistik Utama</h2>
      <ul className="space-y-4">
        {numericStats.map((s, i) => (
          <li key={i} className="flex items-center">
            <span className="w-28 text-sm text-gray-700 dark:text-gray-300 min-w-[70px]">{s.label}</span>
            <div className="flex-1 mx-3 bg-gray-200 dark:bg-gray-700 rounded h-4 relative">
              <div
                className="h-4 bg-blue-500 rounded"
                style={{ width: `${(s.numeric / max) * 100}%` }}
              />
              <span className="absolute right-2 top-0 text-xs text-white font-medium">{s.value}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
