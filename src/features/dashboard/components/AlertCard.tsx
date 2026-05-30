'use client';
import { Card, cn } from '@/features/ui';
import { AlertTriangle, Shield, Clock, ChevronRight } from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  actionRequired: boolean;
}

const PRIORITY_CONFIG: Record<string, { icon: React.ReactNode; gradient: string; badge: string; bg: string }> = {
  critical: { icon: <AlertTriangle className="w-5 h-5" />, gradient: 'from-red-500 to-red-600', badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', bg: 'bg-red-500' },
  high: { icon: <AlertTriangle className="w-5 h-5" />, gradient: 'from-orange-500 to-orange-600', badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300', bg: 'bg-orange-500' },
  medium: { icon: <Shield className="w-5 h-5" />, gradient: 'from-yellow-500 to-yellow-600', badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', bg: 'bg-yellow-500' },
  low: { icon: <Clock className="w-5 h-5" />, gradient: 'from-green-500 to-green-600', badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', bg: 'bg-green-500' },
};

export default function AlertCard({ alert, className = '' }: { alert: Alert; className?: string }) {
  const config = PRIORITY_CONFIG[alert.priority] ?? PRIORITY_CONFIG.medium;

  return (
    <Card className={cn(
      "relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl",
      "border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg",
      "hover:shadow-xl transition-all duration-300 p-5",
      className
    )}>
      <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-5 blur-2xl", config.bg)} />
      <div className="relative flex items-start gap-4">
        <div className={cn("p-3 rounded-xl shadow-lg bg-gradient-to-br text-white shrink-0", config.gradient)}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{alert.title}</h3>
            <span className={cn("px-2.5 py-0.5 rounded-lg text-xs font-semibold shrink-0", config.badge)}>
              {alert.priority}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{alert.description}</p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              {alert.timestamp}
            </div>
            <div className="flex items-center gap-2">
              {alert.actionRequired && (
                <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300">
                  Action Required
                </span>
              )}
              <button className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700">
                Details <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
