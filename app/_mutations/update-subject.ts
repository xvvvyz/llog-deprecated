'use server';

import { Database } from '@/_types/database';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const updateSubject = async (
  subject: Database['public']['Tables']['subjects']['Update'] & { id: string },
) => {
  const supabase = createServerSupabaseClient();

  // get the latest app_metadata for rls validation
  await supabase.auth.refreshSession();

  await supabase
    .from('subjects')
    .update({
      archived: subject.archived,
      deleted: subject.deleted,
      name: subject.name,
      public: subject.public,
    })
    .eq('id', subject.id);
  revalidatePath('/', 'layout');
};

export default updateSubject;
