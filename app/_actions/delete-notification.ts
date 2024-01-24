'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const deleteNotification = async (id: string) => {
  await createServerSupabaseClient()
    .from('notifications')
    .delete()
    .eq('id', id);

  revalidatePath('/', 'layout');
};

export default deleteNotification;
