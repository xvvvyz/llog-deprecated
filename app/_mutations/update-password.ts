'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { redirect } from 'next/navigation';

const updatePassword = async (
  _state: { error: string } | null,
  date: FormData,
) => {
  const { error } = await (
    await createServerSupabaseClient()
  ).auth.updateUser({
    password: date.get('password') as string,
  });

  if (error) return { error: error.message };
  redirect('/subjects');
};

export default updatePassword;
