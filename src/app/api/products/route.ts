import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { z } from 'zod';
import { getProductsByUser, createProduct, deleteProduct } from '@/lib/products';

async function getUserId(request: NextRequest): Promise<string> {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '').trim();
  if (!token) throw new Error('Unauthorized');
  const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload.sub as string;
}

const CreateSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional().default([]),
  platforms: z.array(z.string()).optional().default([]),
});

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    const products = await getProductsByUser(userId);
    return NextResponse.json({ success: true, products });
  } catch (err: any) {
    const status = err.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ success: false, error: err.message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    const body = await request.json();
    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }
    const product = await createProduct(userId, parsed.data);
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (err: any) {
    const status = err.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ success: false, error: err.message }, { status });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    const { id } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
    await deleteProduct(id, userId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    const status = err.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ success: false, error: err.message }, { status });
  }
}
