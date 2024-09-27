'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const deleteEvent = async (id: string) => {
  await (await createServerSupabaseClient())
    .from('events')
    .delete()
    .eq('id', id);
  revalidatePath('/', 'layout');
};

export default deleteEvent;
