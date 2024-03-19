'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const deleteInput = async (id: string) => {
  await createServerSupabaseClient().from('inputs').delete().eq('id', id);
  revalidatePath('/', 'layout');
};

export default deleteInput;
