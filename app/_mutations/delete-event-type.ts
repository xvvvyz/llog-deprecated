'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const deleteEventType = async (id: string) => {
  await (await createServerSupabaseClient())
    .from('event_types')
    .delete()
    .eq('id', id);
  revalidatePath('/', 'layout');
};

export default deleteEventType;
