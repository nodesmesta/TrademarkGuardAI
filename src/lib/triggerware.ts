import 'server-only';

const BASE_URL = 'https://api.triggerware.com';
const API_KEY = process.env.TRIGGERWARE_API_KEY!;

const headers = () => ({
  'Api-Key': API_KEY,
  'Content-Type': 'application/json',
});

// ── Connectors ───────────────────────────────────────────────────────────────

export async function listCatalog() {
  const res = await fetch(`${BASE_URL}/connectors/catalog`, { headers: headers() });
  return res.json();
}

export async function installConnector(name: string) {
  const res = await fetch(`${BASE_URL}/connectors/installed/${name}`, {
    method: 'PUT',
    headers: headers(),
  });
  return res.json();
}

export async function configureConnector(name: string, config: Record<string, string>) {
  const res = await fetch(`${BASE_URL}/connectors/installed/${name}/config`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(config),
  });
  return res.json();
}

export async function createCustomConnector(prompt: string) {
  const res = await fetch(`${BASE_URL}/connectors/custom`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ prompt }),
  });
  return res.json();
}

// ── Queries ──────────────────────────────────────────────────────────────────

export async function query(english: string) {
  const res = await fetch(`${BASE_URL}/query`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ query: english, language: 'english' }),
  });
  return res.json();
}

export async function querySQL(sql: string) {
  const res = await fetch(`${BASE_URL}/query`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ query: sql, language: 'sql' }),
  });
  return res.json();
}

// ── Triggers (Agentic Monitoring) ────────────────────────────────────────────

export async function createTrigger(description: string, name?: string) {
  const body: Record<string, unknown> = { query: description };
  if (name) body.name = name;
  const res = await fetch(`${BASE_URL}/triggers`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function listTriggers() {
  const res = await fetch(`${BASE_URL}/triggers`, { headers: headers() });
  return res.json();
}

export async function pollTrigger(name: string) {
  const res = await fetch(`${BASE_URL}/triggers/${name}/poll`, {
    method: 'POST',
    headers: headers(),
  });
  return res.json();
}

export async function updateTrigger(name: string, patch: { query?: string; schedule?: number; status?: string }) {
  const res = await fetch(`${BASE_URL}/triggers/${name}`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify(patch),
  });
  return res.json();
}

export async function deleteTrigger(name: string) {
  const res = await fetch(`${BASE_URL}/triggers/${name}`, {
    method: 'DELETE',
    headers: headers(),
  });
  return res.json();
}
