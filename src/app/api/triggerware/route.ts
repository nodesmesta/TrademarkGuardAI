import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import * as tw from '@/lib/triggerware';

async function authenticate(req: NextRequest): Promise<boolean> {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '') || req.cookies.get('token')?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET!));
    return true;
  } catch { return false; }
}

export async function GET(req: NextRequest) {
  if (!await authenticate(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const triggers = await tw.listTriggers();
    return NextResponse.json(triggers);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!await authenticate(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'create-trigger': {
        const { description, name } = body;
        const result = await tw.createTrigger(description, name);
        return NextResponse.json(result);
      }
      case 'poll': {
        const { name } = body;
        const result = await tw.pollTrigger(name);
        return NextResponse.json(result);
      }
      case 'query': {
        const { question } = body;
        const result = await tw.query(question);
        return NextResponse.json(result);
      }
      case 'install-connector': {
        const { name } = body;
        const result = await tw.installConnector(name);
        return NextResponse.json(result);
      }
      case 'catalog': {
        const result = await tw.listCatalog();
        return NextResponse.json(result);
      }
      case 'delete-trigger': {
        const { name } = body;
        const result = await tw.deleteTrigger(name);
        return NextResponse.json(result);
      }
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
