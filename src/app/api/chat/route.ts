import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getProductsByUser, createProduct, deleteProduct } from '@/lib/products';
import { supabaseAdmin } from '@/lib/supabase-admin';

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
      description: 'Add a new product/brand to monitor for trademark violations',
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
];

async function getUserId(req: NextRequest): Promise<string | null> {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '') || req.cookies.get('token')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET!));
    return payload.sub as string;
  } catch { return null; }
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
      return `Product "${product.name}" created (ID: ${product.id})`;
    }
    case 'update_product': {
      const { id, ...updates } = args;
      const { error } = await supabaseAdmin.from('products').update(updates).eq('id', id).eq('user_id', userId);
      if (error) return `Error: ${error.message}`;
      return `Product ${id} updated successfully.`;
    }
    case 'delete_product': {
      await deleteProduct(args.id as string, userId);
      return `Product ${args.id} deleted.`;
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
    content: `You are TradeGuard AI, an expert assistant for trademark protection. You can manage the user's products/brands (add, update, delete, list). When the user asks to add/edit/remove a product, use the available functions. Be concise and actionable.${
      pdfText ? `\n\nThe user uploaded a PDF document. Here is the extracted text:\n---\n${pdfText.slice(0, 8000)}\n---\nUse this content to help the user. If they ask to add products from the PDF, extract brand names, keywords, and platforms from it.` : ''
    }`,
  };

  const aiMessages = [systemMsg, ...messages];

  // First call — may return tool_calls
  const res = await fetch(AIML_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.AIML_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages: aiMessages, tools, tool_choice: 'auto', max_tokens: 1024 }),
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
      max_tokens: 1024,
    }),
  });

  if (!res2.ok) return NextResponse.json({ error: 'AI service unavailable' }, { status: 502 });

  const data2 = await res2.json();
  return NextResponse.json({ reply: data2.choices?.[0]?.message?.content ?? 'Done.' });
}
