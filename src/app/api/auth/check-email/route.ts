import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  if (!email) {
    return NextResponse.json({ success: false, error: 'Email parameter missing' }, { status: 400 });
  }

  
  
  console.log('[check-email] Email check skipped - Supabase handles duplicates internally');
  return NextResponse.json({ success: true, exists: false, note: 'Supabase handles duplicate detection' });
}
