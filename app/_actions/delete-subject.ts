'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const deleteSubject = async (id: string) => {
  const supabase = createServerSupabaseClient();
  await supabase.from('subjects').update({ deleted: true }).eq('id', id);
  await supabase.from('input_subjects').delete().eq('subject_id', id);
  revalidatePath('/', 'layout');
};

export default deleteSubject;
