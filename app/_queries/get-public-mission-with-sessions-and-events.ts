import getMissionWithSessionsAndEvents from '@/_queries/get-mission-with-sessions-and-events';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getPublicMissionWithSessionsAndEvents = (missionId: string) =>
  createServerSupabaseClient().rpc(
    'get_public_mission_with_sessions_and_events',
    { public_mission_id: missionId },
  ) as ReturnType<typeof getMissionWithSessionsAndEvents>;

export default getPublicMissionWithSessionsAndEvents;
