import 'server-only';
import { saveMonitoringResult } from './products';

const MCP_URL = 'https://mcp.brightdata.com/mcp';
const API_KEY = process.env.BRIGHTDATA_API_KEY!;

export interface ScrapeResult {
  url?: string;
  title?: string;
  description?: string;
  price?: string;
  seller?: string;
  platform?: string;
  [key: string]: unknown;
}

export interface MonitoringResult {
  snapshotId?: string;
  results: ScrapeResult[];
  violations: ScrapeResult[];
  platform: string;
  query: string;
}

// ── MCP Session & Tools ──────────────────────────────────────────────────────

async function mcpSession(): Promise<string> {
  const res = await fetch(`${MCP_URL}?token=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'tradeguard', version: '1.0' } } }),
  });
  const sessionId = res.headers.get('mcp-session-id');
  if (!sessionId) throw new Error('MCP session init failed');
  return sessionId;
}

async function mcpCall(sessionId: string, tool: string, args: Record<string, unknown>): Promise<string | null> {
  const res = await fetch(`${MCP_URL}?token=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', 'mcp-session-id': sessionId },
    body: JSON.stringify({ jsonrpc: '2.0', id: Date.now(), method: 'tools/call', params: { name: tool, arguments: args } }),
  });
  const text = await res.text();
  const dataLine = text.split('\n').find(l => l.startsWith('data:'));
  if (!dataLine) return null;
  const parsed = JSON.parse(dataLine.replace('data: ', ''));
  return parsed?.result?.content?.[0]?.text || null;
}

interface SerpResult {
  title?: string;
  link?: string;
  description?: string;
}

async function searchSERP(sessionId: string, query: string): Promise<SerpResult[]> {
  const raw = await mcpCall(sessionId, 'search_engine', { query, engine: 'google' });
  if (!raw) return [];
  try {
    return JSON.parse(raw)?.organic || [];
  } catch { return []; }
}

// ── Violation Detection ──────────────────────────────────────────────────────

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

function similarity(a: string, b: string): number {
  if (!a || !b) return 0;
  return 1 - levenshtein(a, b) / Math.max(a.length, b.length);
}

export function detectViolations(results: ScrapeResult[], trademark: string, threshold = 0.75): ScrapeResult[] {
  const lower = trademark.toLowerCase();
  const words = lower.split(/\s+/);

  return results.filter((r) => {
    const text = `${r.title ?? ''} ${r.description ?? ''} ${r.seller ?? ''} ${r.url ?? ''}`.toLowerCase();
    if (text.includes(lower)) return true;
    if (words.length > 1 && words.every(w => text.includes(w))) return true;
    const textWords = text.split(/\s+/);
    return words.some(tw => textWords.some(ww => ww.length >= 3 && similarity(tw, ww) >= threshold));
  });
}

// ── Fast Scan via MCP SERP ───────────────────────────────────────────────────

export async function runMonitoring(
  trademark: string,
  keywords: string[] = [],
  _mode: 'sync' | 'async' = 'sync',
  productId?: string,
  userId?: string
): Promise<MonitoringResult[]> {
  const results: MonitoringResult[] = [];
  const queries = keywords.length ? keywords : [trademark];

  let sessionId: string;
  try {
    sessionId = await mcpSession();
  } catch (e) {
    console.error('[brightdata] MCP session failed:', e);
    return results;
  }

  for (const q of queries) {
    // 1. Marketplace SERP — search for products/shops selling this trademark
    try {
      const serpResults = await searchSERP(sessionId, `"${q}" buy shop marketplace`);
      const scraped: ScrapeResult[] = serpResults.map(r => ({
        title: r.title || '',
        url: r.link || '',
        description: r.description || '',
        seller: r.link ? new URL(r.link).hostname : '',
        platform: 'marketplace',
      }));
      const violations = detectViolations(scraped, trademark);
      results.push({ results: scraped, violations, platform: 'marketplace', query: q });

      if (productId && userId) {
        await saveMonitoringResult({
          product_id: productId, user_id: userId,
          platform: 'marketplace', search_query: q,
          results: scraped, violations,
          violation_count: violations.length,
        }).catch(e => console.error('[brightdata] save error:', e));
      }
    } catch (e) {
      console.error(`[brightdata] marketplace SERP failed for "${q}":`, e);
    }

    // 2. Social media SERP
    try {
      const socialResults = await searchSERP(sessionId, `site:instagram.com OR site:tiktok.com OR site:x.com "${q}"`);
      const scraped: ScrapeResult[] = socialResults.map(r => {
        const host = r.link ? new URL(r.link).hostname : '';
        let platform = 'social';
        if (host.includes('instagram')) platform = 'instagram';
        else if (host.includes('tiktok')) platform = 'tiktok';
        else if (host.includes('x.com') || host.includes('twitter')) platform = 'x';
        return { title: r.title || '', url: r.link || '', description: r.description || '', seller: host, platform };
      });

      // Group by platform
      const platforms = [...new Set(scraped.map(s => s.platform!))];
      for (const platform of platforms) {
        const platformResults = scraped.filter(s => s.platform === platform);
        const violations = detectViolations(platformResults, trademark);
        results.push({ results: platformResults, violations, platform, query: q });

        if (productId && userId) {
          await saveMonitoringResult({
            product_id: productId, user_id: userId,
            platform, search_query: q,
            results: platformResults, violations,
            violation_count: violations.length,
          }).catch(e => console.error('[brightdata] save error:', e));
        }
      }
    } catch (e) {
      console.error(`[brightdata] social SERP failed for "${q}":`, e);
    }
  }

  return results;
}
