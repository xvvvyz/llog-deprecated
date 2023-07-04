import createServerComponentClient from '@/_server/create-server-component-client';

const listSubjectMissions = (subjectId: string) =>
  createServerComponentClient()
    .from('missions')
    .select(
      'id, name, sessions(id, modules:event_types(event:events(id)), order)'
    )
    .eq('subject_id', subjectId)
    .eq('deleted', false)
    .order('name')
    .eq('sessions.deleted', false)
    .eq('sessions.draft', false)
    .order('order', { foreignTable: 'sessions' })
    .or(`scheduled_for.lte.${new Date().toISOString()},scheduled_for.is.null`, {
      foreignTable: 'sessions',
    })
    .eq('sessions.modules.deleted', false);

export type ListSubjectMissionsData = Awaited<
  ReturnType<typeof listSubjectMissions>
>['data'];
export default listSubjectMissions;
