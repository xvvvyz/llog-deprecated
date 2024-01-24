'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { redirect } from 'next/navigation';

const signIn = async (
  context: { next?: string },
  _state: { error: string } | null,
  data: FormData,
) => {
  const { error } = await createServerSupabaseClient().auth.signInWithPassword({
    email: data.get('email') as string,
    password: data.get('password') as string,
  });

  if (error) return { error: error.message };
  redirect(context.next ?? '/subjects');
};

export default signIn;
