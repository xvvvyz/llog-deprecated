import createServerSupabaseClient from './create-server-supabase-client';

const listSubjectEventTypes = (subjectId: string) =>
  createServerSupabaseClient()
    .from('event_types')
    .select('id, name, type')
    .eq('subject_id', subjectId)
    .is('mission_id', null)
    .order('type')
    .order('order');

export type GetSubjectEventTypesData = Awaited<
  ReturnType<typeof listSubjectEventTypes>
>['data'];

export default listSubjectEventTypes;
