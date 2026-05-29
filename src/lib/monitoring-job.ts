import 'server-only';
import { runMonitoring, MonitoringResult } from './brightdata';
import { getAllActiveProducts, saveMonitoringResult, Product } from './products';
import { supabaseAdmin } from './supabase-admin';

// ── Email report ──────────────────────────────────────────────────────────────

async function sendMonitoringReport(
  email: string,
  productName: string,
  results: MonitoringResult[]
): Promise<void> {
  const violations = results.flatMap((r) => r.violations);
  const totalScanned = results.reduce((s, r) => s + r.results.length, 0);

  const violationRows = violations
    .slice(0, 10)
    .map(
      (v) =>
        `<tr>
          <td style="padding:8px;border:1px solid #ddd">${v.title ?? 'N/A'}</td>
          <td style="padding:8px;border:1px solid #ddd">${v.url ?? 'N/A'}</td>
          <td style="padding:8px;border:1px solid #ddd">${v.seller ?? 'N/A'}</td>
        </tr>`
    )
    .join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto">
      <h2 style="color:#1d4ed8">TradeGuard — Monitoring Report</h2>
      <p>Autonomous monitoring completed for <strong>${productName}</strong>.</p>
      <table style="width:100%;border-collapse:collapse;margin:12px 0">
        <tr><td style="padding:6px"><strong>Total results scanned</strong></td><td>${totalScanned}</td></tr>
        <tr><td style="padding:6px"><strong>Violations detected</strong></td><td style="color:${violations.length > 0 ? '#dc2626' : '#16a34a'}">${violations.length}</td></tr>
        <tr><td style="padding:6px"><strong>Platforms checked</strong></td><td>${[...new Set(results.map((r) => r.platform))].join(', ')}</td></tr>
        <tr><td style="padding:6px"><strong>Scanned at</strong></td><td>${new Date().toLocaleString()}</td></tr>
      </table>
      ${
        violations.length > 0
          ? `<h3 style="color:#dc2626">⚠️ Violations Found</h3>
             <table style="width:100%;border-collapse:collapse">
               <thead><tr style="background:#f3f4f6">
                 <th style="padding:8px;border:1px solid #ddd;text-align:left">Title</th>
                 <th style="padding:8px;border:1px solid #ddd;text-align:left">URL</th>
                 <th style="padding:8px;border:1px solid #ddd;text-align:left">Seller</th>
               </tr></thead>
               <tbody>${violationRows}</tbody>
             </table>`
          : `<p style="color:#16a34a">✅ No violations detected. Your trademark appears safe.</p>`
      }
      <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb"/>
      <small style="color:#6b7280">This is an automated report from TradeGuard AI. Powered by Brightdata.</small>
    </div>`;

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.warn('[monitoring-job] RESEND_API_KEY not set — skipping email');
    return;
  }

  const { Resend } = await import('resend');
  const resend = new Resend(resendKey);
  const from = process.env.RESEND_FROM_EMAIL ?? 'no-reply@nodesemesta.com';

  const { error } = await resend.emails.send({
    from,
    to: email,
    subject: `TradeGuard Report: ${productName} — ${violations.length} violation(s) found`,
    html,
  });

  if (error) console.error('[monitoring-job] Email send error:', error);
  else console.log(`[monitoring-job] Report sent to ${email} for "${productName}"`);
}

// ── Get user email from Supabase auth ────────────────────────────────────────

async function getUserEmail(userId: string): Promise<string | null> {
  const { data } = await supabaseAdmin.auth.admin.getUserById(userId);
  return data?.user?.email ?? null;
}

// ── Run monitoring for a single product ──────────────────────────────────────

export async function monitorProduct(
  product: Product,
  triggeredBy: 'cron' | 'manual' = 'cron'
): Promise<{ violations: number; scanned: number; results: MonitoringResult[] }> {
  const results = await runMonitoring(product.name, product.keywords, 'sync');

  for (const r of results) {
    await saveMonitoringResult({
      product_id: product.id,
      user_id: product.user_id,
      platform: r.platform,
      search_query: r.query,
      results: r.results,
      violations: r.violations,
      violation_count: r.violations.length,
      triggered_by: triggeredBy,
    }).catch((e) => console.error('[monitoring-job] saveMonitoringResult error:', e));
  }

  const totalViolations = results.reduce((s, r) => s + r.violations.length, 0);
  const totalScanned = results.reduce((s, r) => s + r.results.length, 0);

  // Send email report if violations found OR it's a cron run
  if (triggeredBy === 'cron' || totalViolations > 0) {
    const email = await getUserEmail(product.user_id);
    if (email) {
      await sendMonitoringReport(email, product.name, results).catch((e) =>
        console.error('[monitoring-job] sendMonitoringReport error:', e)
      );
    }
  }

  return { violations: totalViolations, scanned: totalScanned, results };
}

// ── Run monitoring for ALL active products (called by cron) ──────────────────

export async function runAllMonitoring(): Promise<{
  processed: number;
  totalViolations: number;
  errors: number;
}> {
  const products = await getAllActiveProducts();
  let totalViolations = 0;
  let errors = 0;

  for (const product of products) {
    try {
      const { violations } = await monitorProduct(product, 'cron');
      totalViolations += violations;
    } catch (err) {
      console.error(`[monitoring-job] Failed for product ${product.id}:`, err);
      errors++;
    }
  }

  return { processed: products.length, totalViolations, errors };
}
