'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { redirect } from 'next/navigation';

const signIn = async (
  context: { next?: string },
  _state: { defaultValues: { email: string; password: string }; error: string },
  data: FormData,
) => {
  const email = data.get('email') as string;
  const password = data.get('password') as string;

  const { error } = await (
    await createServerSupabaseClient()
  ).auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { defaultValues: { email, password }, error: error.message };
  }

  redirect(context.next ?? '/subjects');
};

export default signIn;
