import createServerSupabaseClient from './create-server-supabase-client';

const getSubjectEventTypes = (subjectId: string) =>
  createServerSupabaseClient()
    .from('event_types')
    .select('id, name')
    .eq('subject_id', subjectId)
    .is('mission_id', null)
    .order('order');

export type GetSubjectEventTypesData = Awaited<
  ReturnType<typeof getSubjectEventTypes>
>['data'];

export default getSubjectEventTypes;
