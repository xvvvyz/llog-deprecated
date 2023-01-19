import createServerSupabaseClient from './create-server-supabase-client';

const listEventTypes = () =>
  createServerSupabaseClient()
    .from('event_types')
    .select('id, name')
    .order('order');

export type ListEventTypesData = Awaited<
  ReturnType<typeof listEventTypes>
>['data'];

export default listEventTypes;
