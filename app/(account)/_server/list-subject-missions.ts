import createServerComponentClient from '@/_server/create-server-component-client';

const listSubjectMissions = (subjectId: string) =>
  createServerComponentClient()
    .from('missions')
    .select('id, name, sessions(id, modules:event_types(events(id)), order)')
    .eq('subject_id', subjectId)
    .eq('deleted', false)
    .eq('sessions.deleted', false)
    .or(`scheduled_for.lte.${new Date().toISOString()},scheduled_for.is.null`, {
      foreignTable: 'sessions',
    })
    .order('order', { foreignTable: 'sessions' })
    .eq('sessions.modules.deleted', false)
    .order('name');

export type ListSubjectMissionsData = Awaited<
  ReturnType<typeof listSubjectMissions>
>['data'];
export default listSubjectMissions;
