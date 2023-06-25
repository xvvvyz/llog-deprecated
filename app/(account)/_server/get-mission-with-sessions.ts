import createServerComponentClient from '@/_server/create-server-component-client';

const getMissionWithSessions = (missionId: string) =>
  createServerComponentClient()
    .from('missions')
    .select('id, name, sessions(id, order, scheduled_for, title)')
    .eq('id', missionId)
    .eq('sessions.deleted', false)
    .order('order', { foreignTable: 'sessions' })
    .single();

export type GetMissionWithSessionsData = Awaited<
  ReturnType<typeof getMissionWithSessions>
>['data'];

export default getMissionWithSessions;
