import { NextRequest, NextResponse } from 'next/server';
import * as tw from '@/lib/triggerware';

export async function GET() {
  try {
    const triggers = await tw.listTriggers();
    return NextResponse.json(triggers);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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
