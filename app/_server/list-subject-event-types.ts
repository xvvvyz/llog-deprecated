import createServerComponentClient from './create-server-component-client';

const listSubjectEventTypes = (subjectId: string) =>
  createServerComponentClient()
    .from('event_types')
    .select('id, name, type')
    .eq('subject_id', subjectId)
    .is('session_id', null)
    .eq('deleted', false)
    .not('type', 'is', null)
    .order('order');

export type ListSubjectEventTypesData = Awaited<
  ReturnType<typeof listSubjectEventTypes>
>['data'];

export default listSubjectEventTypes;
