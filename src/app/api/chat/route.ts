import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserId } from '@/lib/auth';

export const maxDuration = 60;
import { getProductsByUser, createProduct, deleteProduct } from '@/lib/products';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { monitorProduct } from '@/lib/monitoring-job';
import * as tw from '@/lib/triggerware';

const AIML_URL = 'https://api.aimlapi.com/v1/chat/completions';

const tools = [
  {
    type: 'function',
    function: {
      name: 'list_products',
      description: 'List all products/brands the user is monitoring',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'add_product',
      description: 'Add a new product/brand to monitor for trademark violations. Call this ONCE for EACH product/brand to add.',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Product/brand name' },
          description: { type: 'string', description: 'Brief description' },
          keywords: { type: 'array', items: { type: 'string' }, description: 'Keywords to monitor' },
          platforms: { type: 'array', items: { type: 'string' }, description: 'Platforms to scan (e.g. google, instagram, tiktok, amazon)' },
        },
        required: ['name'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'add_products_from_pdf',
      description: 'Extract ALL brand/product names from the uploaded PDF and add them all to monitoring. Also creates Triggerware triggers and runs initial scan for each product. Use this when user uploads a PDF and asks to add products.',
      parameters: {
        type: 'object',
        properties: {
          products: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Brand/product name' },
                description: { type: 'string', description: 'Brief description' },
                keywords: { type: 'array', items: { type: 'string' }, description: 'Keywords to monitor' },
                platforms: { type: 'array', items: { type: 'string' }, description: 'Platforms (google, instagram, tiktok, amazon)' },
              },
              required: ['name'],
            },
            description: 'Array of all products extracted from the PDF',
          },
        },
        required: ['products'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_product',
      description: 'Update an existing product by id',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Product ID to update' },
          name: { type: 'string' },
          description: { type: 'string' },
          keywords: { type: 'array', items: { type: 'string' } },
          platforms: { type: 'array', items: { type: 'string' } },
          active: { type: 'boolean' },
        },
        required: ['id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'delete_product',
      description: 'Delete a product by id',
      parameters: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'scan_product',
      description: 'Trigger a trademark violation scan for a specific product by its ID.',
      parameters: {
        type: 'object',
        properties: { id: { type: 'string', description: 'Product ID to scan' } },
        required: ['id'],
      },
    },
  },
];

async function getUserId(req: NextRequest): Promise<string | null> {
  return getAuthUserId(req);
}

async function executeTool(name: string, args: Record<string, unknown>, userId: string): Promise<string> {
  switch (name) {
    case 'list_products': {
      const products = await getProductsByUser(userId);
      if (!products.length) return 'No products registered yet.';
      return JSON.stringify(products.map(p => ({ id: p.id, name: p.name, keywords: p.keywords, platforms: p.platforms, active: p.active })));
    }
    case 'add_product': {
      const product = await createProduct(userId, args as { name: string; description?: string; keywords?: string[]; platforms?: string[] });
      // Create Triggerware trigger for ongoing monitoring
      const triggerDesc = `Monitor trademark violations for "${product.name}" across e-commerce and social media platforms`;
      await tw.createTrigger(triggerDesc, `trademark-${product.id}`).catch(e => console.error('[chat] triggerware create failed:', e));
      return `Product "${product.name}" created (ID: ${product.id}), Triggerware trigger activated.`;
    }
    case 'add_products_from_pdf': {
      const { products } = args as { products: { name: string; description?: string; keywords?: string[]; platforms?: string[] }[] };
      const created: { id: string; name: string }[] = [];
      const scanResults: { name: string; violations: number; scanned: number }[] = [];

      for (const p of products) {
        try {
          const product = await createProduct(userId, p);
          created.push({ id: product.id, name: product.name });

          // Create Triggerware trigger
          const triggerDesc = `Monitor trademark violations for "${product.name}" on ${(p.platforms || ['google', 'amazon']).join(', ')}`;
          await tw.createTrigger(triggerDesc, `trademark-${product.id}`).catch(e => console.error('[chat] triggerware create failed:', e));

          // Run initial scan
          const scanResult = await monitorProduct(product, 'manual').catch(e => {
            console.error(`[chat] initial scan failed for ${product.name}:`, e);
            return { violations: 0, scanned: 0, results: [] };
          });
          scanResults.push({ name: product.name, violations: scanResult.violations, scanned: scanResult.scanned });
        } catch (e) {
          console.error(`[chat] add product "${p.name}" failed:`, e);
        }
      }

      return JSON.stringify({
        message: `${created.length} products added, Triggerware triggers created, initial scans completed.`,
        products: created,
        scans: scanResults,
        totalViolations: scanResults.reduce((s, r) => s + r.violations, 0),
      });
    }
    case 'update_product': {
      const { id, ...updates } = args;
      const { error } = await supabaseAdmin.from('products').update(updates).eq('id', id).eq('user_id', userId);
      if (error) return `Error: ${error.message}`;
      return `Product ${id} updated successfully.`;
    }
    case 'delete_product': {
      await deleteProduct(args.id as string, userId);
      await tw.deleteTrigger(`trademark-${args.id}`).catch(() => {});
      return `Product ${args.id} deleted, trigger removed.`;
    }
    case 'scan_product': {
      const { data: product, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('id', args.id)
        .eq('user_id', userId)
        .single();
      if (error || !product) return 'Error: Product not found or access denied.';
      try {
        const { violations, scanned, results } = await monitorProduct(product, 'manual');
        const platforms = [...new Set(results.map((r: { platform: string }) => r.platform))];
        return JSON.stringify({ success: true, scanned, violations, platforms });
      } catch (e) {
        return `Scan failed: ${e instanceof Error ? e.message : 'Unknown error'}`;
      }
    }
    default:
      return 'Unknown function.';
  }
}

export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  const body = await req.json();
  const { messages, pdfText } = body;

  if (!messages?.length) return NextResponse.json({ error: 'No messages' }, { status: 400 });

  const systemMsg = {
    role: 'system',
    content: `You are TradeGuard AI, an expert assistant for trademark protection.

CRITICAL RULES:
1. When user uploads a PDF and asks to "add" or "tambah" products — you MUST call add_products_from_pdf with ALL brands/products extracted from the PDF. This will: save to database, create Triggerware monitoring triggers, AND run initial scans automatically.
2. When user says "scan" or "monitor" a specific product — call scan_product with the product ID. If you don't know the ID, call list_products first.
3. For adding a single product without PDF — use add_product.
4. Never just describe what you would do. ALWAYS call the function.
5. After execution, summarize results concisely.

Available actions: list_products, add_product, add_products_from_pdf, update_product, delete_product, scan_product.${
      pdfText ? `\n\nThe user uploaded a PDF. Extracted text:\n---\n${pdfText.slice(0, 8000)}\n---\nExtract ALL brand/product names from this text and use add_products_from_pdf to add them all at once.` : ''
    }`,
  };

  const aiMessages = [systemMsg, ...messages];

  const res = await fetch(AIML_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.AIML_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages: aiMessages, tools, tool_choice: 'auto', max_tokens: 2048 }),
  });

  if (!res.ok) return NextResponse.json({ error: 'AI service unavailable' }, { status: 502 });

  const data = await res.json();
  const choice = data.choices?.[0]?.message;

  if (!choice?.tool_calls?.length) {
    return NextResponse.json({ reply: choice?.content ?? 'No response.' });
  }

  // Execute tool calls
  const toolMessages = [];
  for (const tc of choice.tool_calls) {
    const args = JSON.parse(tc.function.arguments);
    const result = userId
      ? await executeTool(tc.function.name, args, userId)
      : 'Error: Not authenticated. Please log in.';
    toolMessages.push({ role: 'tool', tool_call_id: tc.id, content: result });
  }

  // Second call with tool results
  const res2 = await fetch(AIML_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.AIML_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [...aiMessages, choice, ...toolMessages],
      tools,
      tool_choice: 'auto',
      max_tokens: 2048,
    }),
  });

  if (!res2.ok) return NextResponse.json({ error: 'AI service unavailable' }, { status: 502 });

  const data2 = await res2.json();
  const choice2 = data2.choices?.[0]?.message;

  // Handle chained tool calls (e.g. list → scan)
  if (choice2?.tool_calls?.length) {
    const toolMessages2 = [];
    for (const tc of choice2.tool_calls) {
      const args = JSON.parse(tc.function.arguments);
      const result = userId
        ? await executeTool(tc.function.name, args, userId)
        : 'Error: Not authenticated. Please log in.';
      toolMessages2.push({ role: 'tool', tool_call_id: tc.id, content: result });
    }

    const res3 = await fetch(AIML_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.AIML_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [...aiMessages, choice, ...toolMessages, choice2, ...toolMessages2],
        max_tokens: 2048,
      }),
    });

    if (!res3.ok) return NextResponse.json({ error: 'AI service unavailable' }, { status: 502 });
    const data3 = await res3.json();
    return NextResponse.json({ reply: data3.choices?.[0]?.message?.content ?? 'Done.' });
  }

  return NextResponse.json({ reply: choice2?.content ?? 'Done.' });
}
