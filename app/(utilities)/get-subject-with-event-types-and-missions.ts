import createServerSupabaseClient from './create-server-supabase-client';

const getSubjectWithEventTypesAndMissions = (subjectId: string) =>
  createServerSupabaseClient()
    .from('subjects')
    .select(
      `
      birthdate,
      event_types(id, name, type),
      id,
      image_uri,
      managers:profiles(first_name, id, last_name),
      missions(id, name),
      name,
      share_code,
      species`
    )
    .eq('id', subjectId)
    .eq('missions.deleted', false)
    .order('name', { foreignTable: 'missions' })
    .is('event_types.session_id', null)
    .eq('event_types.deleted', false)
    .order('type', { foreignTable: 'event_types' })
    .order('order', { foreignTable: 'event_types' })
    .single();

export type GetSubjectWithEventTypesData = Awaited<
  ReturnType<typeof getSubjectWithEventTypesAndMissions>
>['data'];

export default getSubjectWithEventTypesAndMissions;
