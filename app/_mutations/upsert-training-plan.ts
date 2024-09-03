'use server';

import { TrainingPlanFormValues } from '@/_components/training-plan-form';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const upsertTrainingPlan = async (
  context: { subjectId: string; trainingPlanId?: string },
  data: TrainingPlanFormValues,
) => {
  const supabase = createServerSupabaseClient();

  const { data: trainingPlan, error } = await supabase
    .from('training_plans')
    .upsert({
      id: context.trainingPlanId,
      name: data.name,
      subject_id: context.subjectId,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };
  revalidatePath('/', 'layout');
  return { data: trainingPlan };
};

export default upsertTrainingPlan;
