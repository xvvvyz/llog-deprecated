'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const deleteTemplate = async (id: string) => {
  await createServerSupabaseClient().from('templates').delete().eq('id', id);
  revalidatePath('/', 'layout');
};

export default deleteTemplate;
