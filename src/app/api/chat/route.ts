import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  if (!messages?.length) return NextResponse.json({ error: 'No messages' }, { status: 400 });

  const res = await fetch('https://api.aimlapi.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.AIML_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are TradeGuard AI, an expert assistant for trademark protection, IP violations, and brand monitoring. Be concise and actionable.',
        },
        ...messages,
      ],
      max_tokens: 512,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[chat] AI/ML API error:', err);
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 502 });
  }

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content ?? 'No response.';
  return NextResponse.json({ reply });
}
