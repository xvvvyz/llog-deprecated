import createServerSupabaseClient from './create-server-supabase-client';

const getSubjectWithEventTypes = (subjectId: string) =>
  createServerSupabaseClient()
    .from('subjects')
    .select(
      `
      event_types(
        content,
        id,
        inputs(id, label),
        name,
        type
      ),
      id,
      image_uri,
      name`
    )
    .eq('id', subjectId)
    .is('event_types.mission_id', null)
    .order('type', { foreignTable: 'event_types' })
    .order('order', { foreignTable: 'event_types' })
    .single();

export type GetSubjectWithEventTypesData = Awaited<
  ReturnType<typeof getSubjectWithEventTypes>
>['data'];

export default getSubjectWithEventTypes;
