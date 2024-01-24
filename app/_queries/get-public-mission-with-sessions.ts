import getMissionWithSessions from '@/_queries/get-mission-with-sessions';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getPublicMissionWithSessions = (missionId: string) =>
  createServerSupabaseClient().rpc('get_public_mission_with_sessions', {
    public_mission_id: missionId,
  }) as ReturnType<typeof getMissionWithSessions>;

export default getPublicMissionWithSessions;
