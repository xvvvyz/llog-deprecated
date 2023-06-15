import createServerComponentClient from '@/_server/create-server-component-client';

const listSubjectEventTypes = (subjectId: string) =>
  createServerComponentClient()
    .from('event_types')
    .select('id, name')
    .eq('subject_id', subjectId)
    .is('session_id', null)
    .eq('deleted', false)
    .order('order');

export type ListSubjectEventTypesData = Awaited<
  ReturnType<typeof listSubjectEventTypes>
>['data'];

export default listSubjectEventTypes;
