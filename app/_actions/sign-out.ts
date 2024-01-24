'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { redirect } from 'next/navigation';

const signOut = async () => {
  await createServerSupabaseClient().auth.signOut();
  redirect('/sign-in');
};

export default signOut;
