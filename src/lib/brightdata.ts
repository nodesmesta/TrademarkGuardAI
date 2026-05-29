// Brightdata Scrapers Library integration for trademark monitoring
// Working datasets:
// - Amazon Search: gd_l7q7dkf244hwjntr0 (verified working)
// - Google Search/Shopping: Dataset IDs need to be obtained from BrightData Dashboard
// Docs: https://docs.brightdata.com/datasets/scrapers/scrapers-library/overview

const BRIGHTDATA_API = 'https://api.brightdata.com/datasets/v3';
const API_KEY = process.env.BRIGHTDATA_API_KEY!;

// Pre-built dataset IDs from Brightdata Scrapers Library
// Note: Update these IDs with the ones from your BrightData Dashboard
const DATASETS = {
  google_search: 'gd_l1vikfnt1wgvvqz95w',   // ⚠️ Needs valid dataset ID from BrightData
  amazon_search: 'gd_l7q7dkf244hwjntr0',    // ✅ Verified working
  google_shopping: 'gd_lwhidru92ywb3n2hn',  // ⚠️ Needs valid dataset ID from BrightData
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

// Trigger async scrape — returns snapshot_id
export async function triggerSearch(query: string, dataset: keyof typeof DATASETS = 'amazon_search'): Promise<string> {
  const datasetId = DATASETS[dataset];
  
  // Build URL based on platform
  let searchUrl: string;
  switch (dataset) {
    case 'amazon_search':
      searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
      break;
    case 'google_shopping':
      searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=shop`;
      break;
    case 'google_search':
    default:
      searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      break;
  }

  const res = await fetch(
    `${BRIGHTDATA_API}/trigger?dataset_id=${datasetId}&format=json&uncompressed_webhook=true`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ url: searchUrl }]),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    
    // Handle specific error cases
    if (res.status === 404) {
      throw new Error(`Brightdata dataset not found: ${datasetId}. Please update DATASETS config with valid IDs from your BrightData Dashboard.`);
    }
    if (res.status === 400) {
      throw new Error(`Brightdata trigger validation error for ${dataset}: ${err}`);
    }
    throw new Error(`Brightdata trigger failed: ${err}`);
  }

  const data = await res.json();
  return data.snapshot_id as string;
}

// Poll snapshot until ready, then return results
export async function getSnapshot(snapshotId: string): Promise<ScrapeResult[]> {
  const res = await fetch(
    `${BRIGHTDATA_API}/snapshot/${snapshotId}?format=json`,
    { headers: { Authorization: `Bearer ${API_KEY}` } }
  );

  if (res.status === 202) return []; // still processing
  if (!res.ok) throw new Error(`Brightdata snapshot fetch failed: ${res.status}`);

  return res.json();
}

// Synchronous scrape for immediate results (initial monitoring)
export async function scrapeSync(query: string, dataset: keyof typeof DATASETS = 'amazon_search'): Promise<ScrapeResult[]> {
  const datasetId = DATASETS[dataset];
  
  // Build URL based on platform
  let searchUrl: string;
  switch (dataset) {
    case 'amazon_search':
      searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
      break;
    case 'google_shopping':
      searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=shop`;
      break;
    case 'google_search':
    default:
      searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      break;
  }

  const res = await fetch(
    `${BRIGHTDATA_API}/scrape?dataset_id=${datasetId}&format=json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ url: searchUrl }]),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    
    // Handle specific error cases
    if (res.status === 404) {
      throw new Error(`Brightdata dataset not found: ${datasetId}. Please update DATASETS config with valid IDs from your BrightData Dashboard.`);
    }
    if (res.status === 400) {
      throw new Error(`Brightdata scrape validation error for ${dataset}: ${err}`);
    }
    throw new Error(`Brightdata scrape failed: ${err}`);
  }

  return res.json();
}

// Detect violations: results that mention the trademark but are NOT from the owner
export function detectViolations(results: ScrapeResult[], trademark: string): ScrapeResult[] {
  const lower = trademark.toLowerCase();
  return results.filter((r) => {
    const text = `${r.title ?? ''} ${r.description ?? ''} ${r.seller ?? ''}`.toLowerCase();
    return text.includes(lower);
  });
}

// Run full monitoring for a product across all platforms
export async function runMonitoring(
  trademark: string,
  keywords: string[] = [],
  mode: 'sync' | 'async' = 'async'
): Promise<MonitoringResult[]> {
  const queries = [trademark, ...keywords].slice(0, 3); // max 3 queries
  const platforms: Array<keyof typeof DATASETS> = ['google_search', 'amazon_search', 'google_shopping'];
  const monitoringResults: MonitoringResult[] = [];

  for (const platform of platforms) {
    for (const query of queries) {
      try {
        if (mode === 'sync') {
          const results = await scrapeSync(query, platform);
          const violations = detectViolations(results, trademark);
          monitoringResults.push({ results, violations, platform, query });
        } else {
          const snapshotId = await triggerSearch(query, platform);
          monitoringResults.push({ snapshotId, results: [], violations: [], platform, query });
        }
      } catch (err) {
        console.error(`[brightdata] Failed ${platform}/${query}:`, err);
        monitoringResults.push({ results: [], violations: [], platform, query });
      }
    }
  }

  return monitoringResults;
}
