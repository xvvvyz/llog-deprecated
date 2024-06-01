'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const signUp = async (
  context: { next?: string },
  _state: {
    defaultValues: {
      email: string;
      firstName: string;
      lastName: string;
      password: string;
    };
    error: string;
  },
  data: FormData,
) => {
  const proto = headers().get('x-forwarded-proto');
  const host = headers().get('host');
  const email = data.get('email') as string;
  const firstName = data.get('firstName') as string;
  const lastName = data.get('lastName') as string;
  const password = data.get('password') as string;

  const { error } = await createServerSupabaseClient().auth.signUp({
    email,
    options: {
      data: {
        first_name: firstName,
        is_client: context.next?.includes('/join/'),
        last_name: lastName,
      },
      emailRedirectTo: `${proto}://${host}${context.next ?? '/subjects'}`,
    },
    password,
  });

  if (error) {
    return {
      defaultValues: { email, firstName, lastName, password },
      error: error.message,
    };
  }

  redirect('/confirmation-sent');
};

export default signUp;
