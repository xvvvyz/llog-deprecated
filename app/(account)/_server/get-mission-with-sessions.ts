import createServerComponentClient from '@/_server/create-server-component-client';

const getMissionWithSessions = (missionId: string, includeDraft = false) =>
  createServerComponentClient()
    .from('missions')
    .select('id, name, sessions(draft, id, order, scheduled_for, title)')
    .eq('id', missionId)
    .eq('sessions.deleted', false)
    .not('sessions.draft', 'is', includeDraft ? null : true)
    .order('draft', { foreignTable: 'sessions' })
    .order('order', { foreignTable: 'sessions' })
    .single();

export type GetMissionWithSessionsData = Awaited<
  ReturnType<typeof getMissionWithSessions>
>['data'];

export default getMissionWithSessions;
