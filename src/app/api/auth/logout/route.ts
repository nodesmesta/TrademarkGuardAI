import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client'
export async function POST(request: NextRequest) {
    await supabase.auth.signOut();
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })
    response.cookies.set({
      name: 'user',
      value: '',
      expires: new Date(0),
      path: '/'
    })
    response.cookies.set({
      name: 'token',
      value: '',
      expires: new Date(0),
      path: '/'
    })
    return response
}