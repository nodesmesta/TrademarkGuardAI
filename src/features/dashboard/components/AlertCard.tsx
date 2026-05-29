'use client';
import { Card } from '@/features/ui/card';
import { Button } from '@/features/ui/button';
import { 
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ClockIcon,
  ChevronRightIcon 
} from '@heroicons/react/24/outline';
interface Alert {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  actionRequired: boolean;
}
interface AlertCardProps {
  alert: Alert;
  className?: string;
}
export default function AlertCard({ alert, className = '' }: AlertCardProps) {
  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'critical': return <ExclamationTriangleIcon className="w-5 h-5" />;
      case 'high': return <ExclamationTriangleIcon className="w-5 h-5" />;
      case 'medium': return <ShieldCheckIcon className="w-5 h-5" />;
      case 'low': return <ClockIcon className="w-5 h-5" />;
      default: return <ExclamationTriangleIcon className="w-5 h-5" />;
    }
  };
  const getPriorityClasses = (priority: string) => {
    switch(priority) {
      case 'critical': return {
        iconBg: 'bg-danger-50',
        iconText: 'text-danger-600',
        badgeBg: 'bg-danger-100',
        badgeText: 'text-danger-800'
      };
      case 'high': return {
        iconBg: 'bg-warning-50',
        iconText: 'text-warning-600',
        badgeBg: 'bg-warning-100',
        badgeText: 'text-warning-800'
      };
      case 'medium': return {
        iconBg: 'bg-primary-50',
        iconText: 'text-primary-600',
        badgeBg: 'bg-primary-100',
        badgeText: 'text-primary-800'
      };
      case 'low': return {
        iconBg: 'bg-success-50',
        iconText: 'text-success-600',
        badgeBg: 'bg-success-100',
        badgeText: 'text-success-800'
      };
      default: return {
        iconBg: 'bg-gray-50',
        iconText: 'text-gray-600',
        badgeBg: 'bg-gray-100',
        badgeText: 'text-gray-800'
      };
    }
  };
  const priorityClasses = getPriorityClasses(alert.priority);
  return (
    <Card className={`p-5 ${className}`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${priorityClasses.iconBg} ${priorityClasses.iconText}`}>
          {getPriorityIcon(alert.priority)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityClasses.badgeBg} ${priorityClasses.badgeText} ml-2`}>
              {alert.priority}
            </span>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center text-sm text-gray-500">
              <ClockIcon className="w-4 h-4 mr-1" />
              {alert.timestamp}
            </div>
            <div className="flex items-center gap-2">
              {alert.actionRequired && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-danger-100 text-danger-800">
                  Action Required
                </span>
              )}
              <Button size="sm" variant="ghost">
                Details
                <ChevronRightIcon className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}