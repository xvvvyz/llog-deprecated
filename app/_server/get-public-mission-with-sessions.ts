import createServerComponentClient from '@/_server/create-server-component-client';
import getMissionWithSessions from '@/_server/get-mission-with-sessions';

const getPublicMissionWithSessions = (missionId: string) =>
  createServerComponentClient().rpc('get_public_mission_with_sessions', {
    public_mission_id: missionId,
  }) as ReturnType<typeof getMissionWithSessions>;

export default getPublicMissionWithSessions;
