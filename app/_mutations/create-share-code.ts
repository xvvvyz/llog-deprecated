'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';

const createShareCode = async (subjectId: string) => {
  const res = await (
    await createServerSupabaseClient()
  )
    .from('subjects')
    .update({ share_code: nanoid(8) })
    .eq('id', subjectId)
    .select('share_code')
    .single();

  revalidatePath('/', 'layout');
  return res;
};

export default createShareCode;
