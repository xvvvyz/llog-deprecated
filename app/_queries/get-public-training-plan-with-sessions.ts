import getTrainingPlanWithSessions from '@/_queries/get-training-plan-with-sessions';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getPublicTrainingPlanWithSessions = (trainingPlanId: string) =>
  createServerSupabaseClient().rpc('get_public_training_plan_with_sessions', {
    public_training_plan_id: trainingPlanId,
  }) as ReturnType<typeof getTrainingPlanWithSessions>;

export default getPublicTrainingPlanWithSessions;
