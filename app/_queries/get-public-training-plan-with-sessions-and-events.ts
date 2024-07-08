import getTrainingPlanWithSessionsAndEvents from '@/_queries/get-training-plan-with-sessions-and-events';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getPublicTrainingPlanWithSessionsAndEvents = (trainingPlanId: string) =>
  createServerSupabaseClient().rpc(
    'get_public_mission_with_sessions_and_events',
    { public_mission_id: trainingPlanId },
  ) as ReturnType<typeof getTrainingPlanWithSessionsAndEvents>;

export default getPublicTrainingPlanWithSessionsAndEvents;
