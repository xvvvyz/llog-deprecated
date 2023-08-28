import createServerComponentClient from '@/_server/create-server-component-client';

const listSubjectMissions = (subjectId: string) =>
  createServerComponentClient()
    .from('missions')
    .select(
      'id, name, sessions(id, modules:event_types(event:events(id)), order)',
    )
    .eq('subject_id', subjectId)
    .eq('archived', false)
    .order('name')
    .order('order', { foreignTable: 'sessions' })
    .eq('sessions.draft', false)
    .or(`scheduled_for.lte.${new Date().toISOString()},scheduled_for.is.null`, {
      foreignTable: 'sessions',
    })
    .eq('sessions.modules.archived', false);

export type ListSubjectMissionsData = Awaited<
  ReturnType<typeof listSubjectMissions>
>['data'];

export default listSubjectMissions;
