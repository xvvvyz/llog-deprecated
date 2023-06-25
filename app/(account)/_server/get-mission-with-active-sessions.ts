import createServerComponentClient from '@/_server/create-server-component-client';

const getMissionWithActiveSessions = (missionId: string) =>
  createServerComponentClient()
    .from('missions')
    .select('id, name, sessions(id)')
    .eq('id', missionId)
    .eq('sessions.deleted', false)
    .or(`scheduled_for.lte.${new Date().toISOString()},scheduled_for.is.null`, {
      foreignTable: 'sessions',
    })
    .order('order', { foreignTable: 'sessions' })
    .single();

export type GetMissionWithActiveSessionsData = Awaited<
  ReturnType<typeof getMissionWithActiveSessions>
>['data'];

export default getMissionWithActiveSessions;
