'use client';
import { useState } from 'react';
import { CheckCircle, XCircle, Bell, Shield, Clock } from 'lucide-react';

interface ActivityItem {
  id: number | string;
  action: string;
  user: string;
  target: string;
  timestamp: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; bg: string }> = {
  success: { icon: <CheckCircle className="w-4 h-4 text-green-600" />, bg: 'bg-green-50 dark:bg-green-900/20' },
  error: { icon: <XCircle className="w-4 h-4 text-red-600" />, bg: 'bg-red-50 dark:bg-red-900/20' },
  warning: { icon: <Bell className="w-4 h-4 text-orange-600" />, bg: 'bg-orange-50 dark:bg-orange-900/20' },
  info: { icon: <Shield className="w-4 h-4 text-blue-600" />, bg: 'bg-blue-50 dark:bg-blue-900/20' },
};

export default function RecentActivity({ activities, className = '' }: { activities: ActivityItem[]; className?: string }) {
  const [page, setPage] = useState(1);
  const perPage = 5;
  const totalPages = Math.ceil(activities.length / perPage);
  const paginated = activities.slice((page - 1) * perPage, page * perPage);

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h2>
        <span className="text-xs text-gray-500">{activities.length} events</span>
      </div>
      <div className="space-y-3 flex-1">
        {activities.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No recent activity.</p>
        ) : paginated.map((a) => {
          const config = TYPE_CONFIG[a.type] ?? TYPE_CONFIG.info;
          return (
            <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className={`p-2 rounded-lg shrink-0 ${config.bg}`}>{config.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{a.action}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{a.target}</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">{a.timestamp}</span>
            </div>
          );
        })}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500">Page {page}/{totalPages}</p>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${p === page ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
