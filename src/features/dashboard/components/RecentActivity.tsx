'use client';
import { Card } from '@/features/ui/card';
import { Button } from '@/features/ui/button';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  BellIcon, 
  ShieldCheckIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';
interface ActivityItem {
  id: number;
  action: string;
  user: string;
  target: string;
  timestamp: string;
  type: 'success' | 'error' | 'warning' | 'info';
}
interface RecentActivityProps {
  activities: ActivityItem[];
  className?: string;
}
export default function RecentActivity({ activities, className = '' }: RecentActivityProps) {
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircleIcon className="w-5 h-5 text-success-600" />;
      case 'error': return <XCircleIcon className="w-5 h-5 text-danger-600" />;
      case 'warning': return <BellIcon className="w-5 h-5 text-warning-600" />;
      case 'info': return <ShieldCheckIcon className="w-5 h-5 text-primary-600" />;
      default: return <ClockIcon className="w-5 h-5 text-gray-600" />;
    }
  };
  const getTypeColor = (type: string) => {
    switch(type) {
      case 'success': return 'bg-success-50';
      case 'error': return 'bg-danger-50';
      case 'warning': return 'bg-warning-50';
      case 'info': return 'bg-primary-50';
      default: return 'bg-gray-50';
    }
  };
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          <p className="text-sm text-gray-600">Latest system and user activities</p>
        </div>
        <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-800">
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${getTypeColor(activity.type)}`}>
              {getTypeIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.action}</p>
              <p className="text-xs text-gray-600">
                by {activity.user}  {activity.target}
              </p>
            </div>
            <div className="text-xs text-gray-500 whitespace-nowrap">
              {activity.timestamp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}