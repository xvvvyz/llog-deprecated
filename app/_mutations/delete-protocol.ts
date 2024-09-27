'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const deleteProtocol = async (id: string) => {
  await (await createServerSupabaseClient())
    .from('protocols')
    .delete()
    .eq('id', id);

  revalidatePath('/', 'layout');
};

export default deleteProtocol;
