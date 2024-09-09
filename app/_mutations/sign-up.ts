'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Resend } from 'resend';

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
  const isClient = context.next?.includes('/join/');

  const { error } = await createServerSupabaseClient().auth.signUp({
    email,
    options: {
      data: {
        first_name: firstName,
        is_client: isClient,
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

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'system@llog.app',
    html: `<pre>${JSON.stringify(
      {
        email,
        firstName,
        isClient,
        lastName,
      },
      null,
      2,
    )}</pre>`,
    subject: 'New llog sign up',
    to: ['cade@llog.app'],
  });

  redirect('/confirmation-sent');
};

export default signUp;
