import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  const { email, name } = await request.json();
  const normalizedEmail = email.toLowerCase().trim();

  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email: normalizedEmail,
    email_confirm: true,
    user_metadata: name ? { full_name: name } : {},
  });

  if (createError) {
    if (createError.message.includes('already registered') || createError.message.includes('duplicate')) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'USER_EXISTS', message: 'Account already exists' } 
      }, { status: 409 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: { code: 'CREATE_ERROR', message: createError.message } 
    }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'Account created successfully!',
    user: {
      id: newUser.user.id,
      email: newUser.user.email,
      name: newUser.user.user_metadata?.full_name || '',
    },
  });
}
