import createServerComponentClient from '@/_server/create-server-component-client';

const listMissions = (subjectId: string) =>
  createServerComponentClient()
    .from('missions')
    .select('id, name, sessions(id, parts:event_types(events(id)))')
    .eq('subject_id', subjectId)
    .eq('deleted', false)
    .eq('sessions.deleted', false)
    .or(`scheduled_for.lte.${new Date().toISOString()},scheduled_for.is.null`, {
      foreignTable: 'sessions',
    })
    .order('order', { foreignTable: 'sessions' })
    .eq('sessions.parts.deleted', false)
    .order('name');

export type ListMissionsData = Awaited<ReturnType<typeof listMissions>>['data'];
export default listMissions;
