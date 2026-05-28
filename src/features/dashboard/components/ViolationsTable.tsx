'use client';
import { Card } from '@/features/ui/card';
import { Button } from '@/features/ui/button';
import { EyeIcon, ShieldCheckIcon, XCircleIcon } from '@heroicons/react/24/outline';
interface Violation {
  id: number;
  domain: string;
  brand: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  detected: string;
  status: 'active' | 'investigating' | 'resolved' | 'dismissed';
  confidence: number;
}
interface ViolationsTableProps {
  violations: Violation[];
  className?: string;
}
export default function ViolationsTable({ violations, className = '' }: ViolationsTableProps) {
  const getSeverityColorClasses = (severity: string) => {
    switch(severity) {
      case 'critical': return 'bg-danger-100 text-danger-800';
      case 'high': return 'bg-warning-100 text-warning-800';
      case 'medium': return 'bg-primary-100 text-primary-800';
      case 'low': return 'bg-success-100 text-success-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-success-600';
    if (confidence >= 70) return 'bg-warning-600';
    return 'bg-danger-600';
  };
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Violations Table</h2>
          <p className="text-sm text-gray-600">Real-time trademark violation detection</p>
        </div>
        <Button variant="primary" size="sm" className="whitespace-nowrap">
          View All
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detected</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {violations.map((violation) => (
              <tr key={violation.id}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {violation.domain}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {violation.brand}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColorClasses(violation.severity)}`}>
                    {violation.severity}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {violation.type}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {violation.detected}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getConfidenceColor(violation.confidence)}`}
                        style={{ width: `${violation.confidence}%` }}
                      />
                    </div>
                    <span className="ml-2 text-xs font-medium text-gray-700">{violation.confidence}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="text-gray-600 hover:text-gray-900">
                      <EyeIcon className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-gray-600 hover:text-gray-900">
                      <ShieldCheckIcon className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-gray-600 hover:text-gray-900">
                      <XCircleIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}