'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const deleteComment = async (id: string) => {
  await (await createServerSupabaseClient())
    .from('comments')
    .delete()
    .eq('id', id);
  revalidatePath('/', 'layout');
};

export default deleteComment;
