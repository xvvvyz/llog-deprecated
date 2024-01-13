import createServerComponentClient from '@/_server/create-server-component-client';
import getMissionWithSessionsAndEvents from '@/_server/get-mission-with-sessions-and-events';

const getPublicMissionWithSessionsAndEvents = (missionId: string) =>
  createServerComponentClient().rpc(
    'get_public_mission_with_sessions_and_events',
    { public_mission_id: missionId },
  ) as ReturnType<typeof getMissionWithSessionsAndEvents>;

export default getPublicMissionWithSessionsAndEvents;
