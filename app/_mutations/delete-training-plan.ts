'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const deleteTrainingPlan = async (id: string) => {
  await createServerSupabaseClient()
    .from('training_plans')
    .delete()
    .eq('id', id);

  revalidatePath('/', 'layout');
};

export default deleteTrainingPlan;
