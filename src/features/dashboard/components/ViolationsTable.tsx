'use client';
import { useState } from 'react';

interface Violation {
  id: string | number;
  domain: string;
  brand: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  detected: string;
  status: 'active' | 'investigating' | 'resolved' | 'dismissed';
  confidence: number;
  url?: string;
  title?: string;
  platform?: string;
  seller?: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  amazon: 'bg-orange-100 text-orange-800',
  google: 'bg-blue-100 text-blue-800',
  instagram: 'bg-pink-100 text-pink-800',
  tiktok: 'bg-gray-900 text-white',
  x: 'bg-gray-100 text-gray-800',
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

export default function ViolationsTable({ violations = [], className = '' }: { violations: Violation[]; className?: string }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const platforms = ['all', ...new Set(violations.map((v) => v.platform ?? 'unknown').filter(Boolean))];

  const filtered = violations.filter((v) => {
    const matchPlatform = filter === 'all' || v.platform === filter;
    const matchSearch = !search || [v.brand, v.title, v.domain, v.seller].some((f) => f?.toLowerCase().includes(search.toLowerCase()));
    return matchPlatform && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg p-6 flex flex-col ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Violations</h2>
          <p className="text-sm text-gray-500">{filtered.length} of {violations.length} results</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-40"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {platforms.map((p) => <option key={p} value={p}>{p === 'all' ? 'All Platforms' : p}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm py-8 text-center flex-1 flex items-center justify-center">No violations found.</p>
      ) : (
        <div className="flex flex-col flex-1">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 pr-4">Platform</th>
                  <th className="pb-3 pr-4">Title / Domain</th>
                  <th className="pb-3 pr-4">Brand</th>
                  <th className="pb-3 pr-4">Severity</th>
                  <th className="pb-3 pr-4">Confidence</th>
                  <th className="pb-3">URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {paginated.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 pr-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${PLATFORM_COLORS[v.platform ?? ''] ?? 'bg-gray-100 text-gray-700'}`}>
                        {v.platform ?? 'unknown'}
                      </span>
                    </td>
                    <td className="py-3 pr-4 max-w-xs">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{v.title || v.domain}</p>
                      {v.seller && <p className="text-xs text-gray-400 truncate">{v.seller}</p>}
                    </td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">{v.brand}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${SEVERITY_COLORS[v.severity] ?? 'bg-gray-100 text-gray-700'}`}>
                        {v.severity}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: `${v.confidence}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{v.confidence}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      {v.url ? (
                        <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs truncate block max-w-[180px]">
                          {v.url}
                        </a>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500">Page {page} of {totalPages} ({filtered.length} results)</p>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${p === page ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
