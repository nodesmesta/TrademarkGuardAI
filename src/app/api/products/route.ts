import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getProductsByUser, createProduct, deleteProduct } from '@/lib/products';

async function getUserId(request: NextRequest): Promise<string | null> {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') || request.cookies.get('token')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET!));
    return payload.sub as string;
  } catch { return null; }
}

export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const products = await getProductsByUser(userId);
  return NextResponse.json({ success: true, products });
}

export async function POST(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const product = await createProduct(userId, body);
  return NextResponse.json({ success: true, product }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const { id } = await request.json();
  await deleteProduct(id, userId);
  return NextResponse.json({ success: true });
}
