import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserId } from '@/lib/auth';
import { getProductsByUser, createProduct, deleteProduct } from '@/lib/products';

export async function GET(request: NextRequest) {
  const userId = await getAuthUserId(request);
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const products = await getProductsByUser(userId);
  return NextResponse.json({ success: true, products });
}

export async function POST(request: NextRequest) {
  const userId = await getAuthUserId(request);
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const product = await createProduct(userId, body);
  return NextResponse.json({ success: true, product }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const userId = await getAuthUserId(request);
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const { id } = await request.json();
  await deleteProduct(id, userId);
  return NextResponse.json({ success: true });
}
