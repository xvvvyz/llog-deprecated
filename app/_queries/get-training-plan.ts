import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getTrainingPlan = (trainingPlanId: string) =>
  createServerSupabaseClient()
    .from('missions')
    .select('id, name')
    .eq('id', trainingPlanId)
    .single();

export type GetTrainingPlanData = Awaited<
  ReturnType<typeof getTrainingPlan>
>['data'];

export default getTrainingPlan;
