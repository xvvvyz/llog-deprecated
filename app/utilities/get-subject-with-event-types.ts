import createServerSupabaseClient from './create-server-supabase-client';

const getSubjectWithEventTypes = (subjectId: string) =>
  createServerSupabaseClient()
    .from('subjects')
    .select(
      'id, image_uri, name, event_types(content, id, name, inputs(id, label))'
    )
    .eq('id', subjectId)
    .is('event_types.mission_id', null)
    .order('order', { foreignTable: 'event_types' })
    .single();

export type GetSubjectWithEventTypesData = Awaited<
  ReturnType<typeof getSubjectWithEventTypes>
>['data'];

export default getSubjectWithEventTypes;
