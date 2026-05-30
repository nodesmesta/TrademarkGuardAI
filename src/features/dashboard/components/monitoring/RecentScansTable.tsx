import React from 'react';

interface ScanItem { id: string; action: string; user: string; target: string; timestamp: string; type: string }
interface Props { scans: ScanItem[] }

export default function RecentScansTable({ scans }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6 overflow-x-auto">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Recent Scans</h2>
      <table className="w-full text-left table-auto">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-3 py-2 text-xs text-gray-500 uppercase">Time</th>
            <th className="px-3 py-2 text-xs text-gray-500 uppercase">Action</th>
            <th className="px-3 py-2 text-xs text-gray-500 uppercase">Target</th>
            <th className="px-3 py-2 text-xs text-gray-500 uppercase">Status</th>
          </tr>
        </thead>
        <tbody>
          {scans.map((s) => (
            <tr key={s.id} className="border-t border-gray-200 dark:border-gray-600">
              <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300">{s.timestamp}</td>
              <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200">{s.action}</td>
              <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{s.target}</td>
              <td className="px-3 py-2">
                <span className={`px-2 py-1 text-xs rounded ${s.type === 'warning' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {s.type}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
