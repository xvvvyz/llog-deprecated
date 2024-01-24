'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const updateSubject = async (subject: { public: boolean; id: string }) => {
  await createServerSupabaseClient()
    .from('subjects')
    .update(subject)
    .eq('id', subject.id);

  revalidatePath('/', 'layout');
};

export default updateSubject;
