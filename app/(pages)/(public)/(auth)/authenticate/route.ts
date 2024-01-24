import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { EmailOtpType } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  await createServerSupabaseClient().auth.verifyOtp({
    token_hash: searchParams.get('token_hash') as string,
    type: searchParams.get('type') as EmailOtpType,
  });

  const redirectTo = req.nextUrl.clone();
  redirectTo.searchParams.delete('next');
  redirectTo.searchParams.delete('token_hash');
  redirectTo.searchParams.delete('type');

  if (searchParams.has('next')) {
    const { pathname } = new URL(searchParams.get('next') as string);
    redirectTo.pathname = pathname;
  } else {
    redirectTo.pathname = '/subjects';
  }

  return NextResponse.redirect(redirectTo);
};
