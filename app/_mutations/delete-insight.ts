'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const deleteInsight = async (id: string) => {
  await createServerSupabaseClient().from('insights').delete().eq('id', id);
  revalidatePath('/', 'layout');
};

export default deleteInsight;
