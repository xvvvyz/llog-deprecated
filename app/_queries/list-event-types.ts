import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listEventTypes = async (subjectId: string) =>
  (await createServerSupabaseClient())
    .from('event_types')
    .select('id, name')
    .eq('subject_id', subjectId)
    .is('session_id', null)
    .eq('archived', false)
    .order('name');

export type ListEventTypesData = Awaited<
  ReturnType<typeof listEventTypes>
>['data'];

export default listEventTypes;
