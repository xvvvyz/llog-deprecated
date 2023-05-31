import createServerComponentClient from '@/_server/create-server-component-client';

const getMission = (missionId: string) =>
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

export type GetMissionData = Awaited<ReturnType<typeof getMission>>['data'];
export default getMission;
