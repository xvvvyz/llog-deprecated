import getTrainingPlanWithSessionsAndEvents from '@/_queries/get-training-plan-with-sessions-and-events';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getPublicTrainingPlanWithSessionsAndEvents = (trainingPlanId: string) =>
  createServerSupabaseClient().rpc(
    'get_public_training_plan_with_sessions_and_events',
    { public_training_plan_id: trainingPlanId },
  ) as ReturnType<typeof getTrainingPlanWithSessionsAndEvents>;

export default getPublicTrainingPlanWithSessionsAndEvents;
