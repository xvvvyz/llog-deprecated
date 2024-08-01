'use server';

import { TrainingPlanFormValues } from '@/_components/training-plan-form';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const upsertTrainingPlan = async (
  context: { missionId?: string; subjectId: string },
  data: TrainingPlanFormValues,
) => {
  const supabase = createServerSupabaseClient();

  const { data: mission, error } = await supabase
    .from('missions')
    .upsert({
      id: context.missionId,
      name: data.name,
      subject_id: context.subjectId,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };
  revalidatePath('/', 'layout');
  return { data: mission };
};

export default upsertTrainingPlan;
