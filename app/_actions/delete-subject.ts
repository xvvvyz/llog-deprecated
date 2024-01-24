'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const deleteSubject = async (id: string) => {
  await createServerSupabaseClient()
    .from('subjects')
    .update({ deleted: true })
    .eq('id', id);

  revalidatePath('/', 'layout');
};

export default deleteSubject;
