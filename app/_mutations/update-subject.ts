'use server';

import { Database } from '@/_types/database';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const updateSubject = async (
  subject: Database['public']['Tables']['subjects']['Update'] & { id: string },
) => {
  await createServerSupabaseClient()
    .from('subjects')
    .update(subject)
    .eq('id', subject.id);

  revalidatePath('/', 'layout');
};

export default updateSubject;
