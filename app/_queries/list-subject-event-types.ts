import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listSubjectEventTypes = (subjectId: string) =>
  createServerSupabaseClient()
    .from('event_types')
    .select('id, name')
    .eq('subject_id', subjectId)
    .is('session_id', null)
    .eq('archived', false)
    .order('name');

export type ListSubjectEventTypesData = Awaited<
  ReturnType<typeof listSubjectEventTypes>
>['data'];

export default listSubjectEventTypes;
