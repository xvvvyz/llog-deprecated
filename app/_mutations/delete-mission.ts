'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const deleteMission = async (id: string) => {
  await createServerSupabaseClient().from('missions').delete().eq('id', id);
  revalidatePath('/', 'layout');
};

export default deleteMission;
