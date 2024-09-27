'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const forgotPassword = async (
  _state: { defaultValues: { email: string }; error: string },
  data: FormData,
) => {
  const { get } = await headers();
  const proto = get('x-forwarded-proto');
  const host = get('host');
  const email = data.get('email') as string;

  const { error } = await (
    await createServerSupabaseClient()
  ).auth.resetPasswordForEmail(email, {
    redirectTo: `${proto}://${host}/change-password`,
  });

  if (error) return { defaultValues: { email }, error: error.message };
  redirect('/forgot-password/email-sent');
};

export default forgotPassword;
