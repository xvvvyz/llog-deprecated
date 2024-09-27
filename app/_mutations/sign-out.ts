'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { redirect } from 'next/navigation';

const signOut = async () => {
  await (await createServerSupabaseClient()).auth.signOut({ scope: 'local' });
  redirect('/sign-in');
};

export default signOut;
