'use client';
import { Card } from '@/features/ui/card';
import { cn } from '@/features/ui';
import { 
  Package,
  ScanLine,
  Mail,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: 'products' | 'scan' | 'email' | 'illegal';
  className?: string;
}

export default function StatCard({
  label,
  value,
  change,
  changeType = 'neutral',
  icon,
  className = ''
}: StatCardProps) {
  const getIcon = () => {
    switch(icon) {
      case 'products':
        return <Package className="w-6 h-6" />;
      case 'scan':
        return <ScanLine className="w-6 h-6" />;
      case 'email':
        return <Mail className="w-6 h-6" />;
      case 'illegal':
        return <AlertTriangle className="w-6 h-6" />;
      default:
        return <Package className="w-6 h-6" />;
    }
  };

  const getIconContainerClasses = () => {
    switch(icon) {
      case 'products':
        return 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/25';
      case 'scan':
        return 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/25';
      case 'email':
        return 'bg-gradient-to-br from-green-500 to-green-600 shadow-green-500/25';
      case 'illegal':
        return 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/25';
      default:
        return 'bg-gradient-to-br from-gray-500 to-gray-600 shadow-gray-500/25';
    }
  };

  const getChangeColor = () => {
    if (changeType === 'increase') return 'text-green-600 dark:text-green-400';
    if (changeType === 'decrease') return 'text-red-600 dark:text-red-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  const getChangeIcon = () => {
    if (changeType === 'increase') return <ArrowUpRight className="w-4 h-4" />;
    if (changeType === 'decrease') return <ArrowDownRight className="w-4 h-4" />;
    return null;
  };

  return (
    <Card className={cn(
      "relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl",
      "border border-gray-200/50 dark:border-gray-700/50",
      "rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300",
      "group hover:scale-[1.02]",
      className
    )}>
      {/* Background gradient effect */}
      <div className={cn(
        "absolute top-0 right-0 w-32 h-32 opacity-10 blur-2xl",
        "transition-opacity duration-300 group-hover:opacity-20",
        icon === 'products' && "bg-blue-500",
        icon === 'scan' && "bg-purple-500",
        icon === 'email' && "bg-green-500",
        icon === 'illegal' && "bg-red-500"
      )} />

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              {label}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
          </div>
          <div className={cn(
            "p-3 rounded-xl shadow-lg",
            getIconContainerClasses(),
            "text-white transition-transform duration-300 group-hover:scale-110"
          )}>
            {getIcon()}
          </div>
        </div>

        {change && (
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-1 text-sm font-semibold",
              getChangeColor()
            )}>
              {getChangeIcon()}
              {change}
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              vs last week
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
