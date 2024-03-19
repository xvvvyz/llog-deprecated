'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const forgotPassword = async (
  _state: { error: string } | null,
  data: FormData,
) => {
  const proto = headers().get('x-forwarded-proto');
  const host = headers().get('host');

  const { error } =
    await createServerSupabaseClient().auth.resetPasswordForEmail(
      data.get('email') as string,
      { redirectTo: `${proto}://${host}/change-password` },
    );

  if (error) return { error: error.message };
  redirect('/forgot-password/email-sent');
};

export default forgotPassword;
