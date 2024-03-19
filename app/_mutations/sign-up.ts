'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const signUp = async (
  context: { next?: string },
  _state: { error: string } | null,
  data: FormData,
) => {
  const proto = headers().get('x-forwarded-proto');
  const host = headers().get('host');

  const { error } = await createServerSupabaseClient().auth.signUp({
    email: data.get('email') as string,
    options: {
      data: {
        first_name: data.get('firstName') as string,
        is_client: context.next?.includes('/join/'),
        last_name: data.get('lastName') as string,
      },
      emailRedirectTo: `${proto}://${host}${context.next ?? '/subjects'}`,
    },
    password: data.get('password') as string,
  });

  if (error) return { error: error.message };
  redirect('/confirmation-sent');
};

export default signUp;
