import 'server-only';
import { saveMonitoringResult } from './products';

const BRIGHTDATA_API = 'https://api.brightdata.com/datasets/v3';
const MCP_URL        = 'https://mcp.brightdata.com/mcp';
const API_KEY        = process.env.BRIGHTDATA_API_KEY!;

// ── Dataset IDs ──────────────────────────────────────────────────────────────
export const DATASETS = {
  // Search engines
  google_search:    'gd_l1vikfnt1wgvvqz95w',
  google_shopping:  'gd_lwhidru92ywb3n2hn',
  // E-commerce
  amazon_search:    'gd_l7q7dkf244hwjntr0',
  // Social media
  instagram_posts:  'gd_lk5ns7kz21pck8jpis',
  tiktok_posts:     'gd_lu702nij2f790tmv9h',
  x_posts:          'gd_lwxkxvnf1cynvib9co',
} as const;

export type DatasetKey = keyof typeof DATASETS;

// Platform groups untuk scan awal
const SEARCH_PLATFORMS  = ['google_search', 'google_shopping'] as const;
const SOCIAL_PLATFORMS  = ['instagram.com', 'tiktok.com', 'x.com'] as const;
const PROMO_PLATFORMS   = ['amazon.com'] as const;

// Regex untuk klasifikasi URL social media
const SOCIAL_URL_PATTERNS: Record<string, RegExp> = {
  instagram_posts: /https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel)\/[^/?#]+/,
  tiktok_posts:    /https?:\/\/(?:www\.)?tiktok\.com\/@[^/]+\/video\/\d+/,
  x_posts:         /https?:\/\/(?:www\.)?x\.com\/[^/]+\/status\/\d+/,
};

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

// ── MCP helpers ──────────────────────────────────────────────────────────────
async function mcpSession(): Promise<string> {
  const res = await fetch(`${MCP_URL}?token=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'trademark-guard', version: '1.0' } } }),
  });
  const sessionId = res.headers.get('mcp-session-id');
  if (!sessionId) throw new Error('MCP session init failed');
  return sessionId;
}

async function mcpSearchEngine(query: string, sessionId: string): Promise<{ link?: string }[]> {
  const res = await fetch(`${MCP_URL}?token=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', 'mcp-session-id': sessionId },
    body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'search_engine', arguments: { query, engine: 'google' } } }),
  });
  const text = await res.text();
  const dataLine = text.split('\n').find((l) => l.startsWith('data:'));
  if (!dataLine) return [];
  const parsed = JSON.parse(dataLine.replace('data: ', ''));
  const content = parsed?.result?.content?.[0]?.text;
  if (!content) return [];
  try { return JSON.parse(content).organic ?? []; } catch { return []; }
}

// ── SERP Discovery via MCP ───────────────────────────────────────────────────
async function discoverSocialUrls(keyword: string): Promise<Record<string, string[]>> {
  const buckets: Record<string, string[]> = { instagram_posts: [], tiktok_posts: [], x_posts: [] };

  try {
    const sessionId = await mcpSession();

    for (const site of SOCIAL_PLATFORMS) {
      const organic = await mcpSearchEngine(`site:${site} "${keyword}"`, sessionId);
      for (const { link = '' } of organic) {
        for (const [dataset, pattern] of Object.entries(SOCIAL_URL_PATTERNS)) {
          if (pattern.test(link)) { buckets[dataset].push(link); break; }
        }
      }
    }
  } catch (e) {
    console.error('[brightdata] MCP social discovery failed:', e);
  }

  for (const k of Object.keys(buckets)) buckets[k] = [...new Set(buckets[k])];
  return buckets;
}

// ── Core BrightData helpers ──────────────────────────────────────────────────
export async function triggerSearch(query: string, dataset: DatasetKey = 'amazon_search'): Promise<string> {
  const urlMap: Record<string, string> = {
    amazon_search:   `https://www.amazon.com/s?k=${encodeURIComponent(query)}`,
    google_shopping: `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=shop`,
    google_search:   `https://www.google.com/search?q=${encodeURIComponent(query)}`,
  };
  const searchUrl = urlMap[dataset] ?? urlMap.google_search;

  const res = await fetch(`${BRIGHTDATA_API}/trigger?dataset_id=${DATASETS[dataset]}&format=json&uncompressed_webhook=true`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([{ url: searchUrl }]),
  });
  if (!res.ok) throw new Error(`Brightdata trigger failed: ${await res.text()}`);
  return (await res.json()).snapshot_id as string;
}

export async function triggerSocialUrls(urls: string[], dataset: DatasetKey): Promise<string | null> {
  if (!urls.length) return null;
  const res = await fetch(`${BRIGHTDATA_API}/trigger?dataset_id=${DATASETS[dataset]}&format=json`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(urls.map((url) => ({ url }))),
  });
  if (!res.ok) return null;
  return (await res.json()).snapshot_id as string;
}

export async function getSnapshot(
  snapshotId: string,
  { maxRetries = 12, intervalMs = 5000 }: { maxRetries?: number; intervalMs?: number } = {}
): Promise<ScrapeResult[]> {
  for (let i = 0; i < maxRetries; i++) {
    const res = await fetch(`${BRIGHTDATA_API}/snapshot/${snapshotId}?format=json`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    if (res.status === 202) {
      // still processing — wait and retry
      await new Promise((r) => setTimeout(r, intervalMs));
      continue;
    }
    if (!res.ok) throw new Error(`Brightdata snapshot fetch failed: ${res.status}`);
    return res.json();
  }
  console.warn(`[brightdata] snapshot ${snapshotId} not ready after ${maxRetries} retries`);
  return [];
}

// Levenshtein distance untuk fuzzy matching
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

function similarityScore(a: string, b: string): number {
  if (!a || !b) return 0;
  const maxLen = Math.max(a.length, b.length);
  return 1 - levenshtein(a, b) / maxLen;
}

export function detectViolations(results: ScrapeResult[], trademark: string, threshold = 0.75): ScrapeResult[] {
  const lower = trademark.toLowerCase();
  const words = lower.split(/\s+/);

  return results.filter((r) => {
    const text = `${r.title ?? ''} ${r.description ?? ''} ${r.seller ?? ''} ${r.url ?? ''}`.toLowerCase();

    // 1. exact substring match
    if (text.includes(lower)) return true;

    // 2. all words present (partial match)
    if (words.length > 1 && words.every((w) => text.includes(w))) return true;

    // 3. fuzzy match per word in text
    const textWords = text.split(/\s+/);
    return words.some((tw) =>
      textWords.some((ww) => ww.length >= 3 && similarityScore(tw, ww) >= threshold)
    );
  });
}

// ── Main: scan semua platform ────────────────────────────────────────────────
export async function runMonitoring(
  trademark: string,
  keywords: string[] = [],
  _mode: 'sync' | 'async' = 'async',
  productId?: string,
  userId?: string
): Promise<MonitoringResult[]> {
  const results: MonitoringResult[] = [];
  const queries = keywords.length ? keywords : [trademark];

  // 1. Search engines + e-commerce (query-based)
  const queryDatasets: DatasetKey[] = ['google_search', 'google_shopping', 'amazon_search'];

  for (const q of queries) {
    for (const dataset of queryDatasets) {
      try {
        const snapshotId = await triggerSearch(q, dataset);
        const scraped    = await getSnapshot(snapshotId);
        const violations = detectViolations(scraped, trademark);
        const platform   = dataset.split('_')[0]; // 'google' | 'amazon'

        results.push({ snapshotId, results: scraped, violations, platform, query: q });

        if (productId && userId) {
          await saveMonitoringResult({
            product_id: productId, user_id: userId,
            platform, search_query: q,
            results: scraped, violations,
            violation_count: violations.length,
            snapshot_id: snapshotId,
          });
        }
      } catch (e) {
        console.error(`[brightdata] ${dataset} scan failed for "${q}":`, e);
      }
    }

    // 2. Social media — discover URLs via MCP, lalu scrape
    try {
        const socialBuckets = await discoverSocialUrls(q);

        for (const [dataset, urls] of Object.entries(socialBuckets) as [DatasetKey, string[]][]) {
          if (!urls.length) continue;
          const snapshotId = await triggerSocialUrls(urls, dataset);
          if (!snapshotId) continue;

          const scraped    = await getSnapshot(snapshotId);
          const violations = detectViolations(scraped, trademark);
          const platform   = dataset.split('_')[0]; // 'instagram' | 'tiktok' | 'x'

          results.push({ snapshotId, results: scraped, violations, platform, query: q });

          if (productId && userId) {
            await saveMonitoringResult({
              product_id: productId, user_id: userId,
              platform, search_query: q,
              results: scraped, violations,
              violation_count: violations.length,
              snapshot_id: snapshotId,
            });
          }
        }
      } catch (e) {
        console.error(`[brightdata] social scan failed for "${q}":`, e);
      }
  }

  return results;
}
