import createServerSupabaseClient from './create-server-supabase-client';

const listMissionsWithRoutinesAndEvents = (subjectId: string) =>
  createServerSupabaseClient()
    .from('missions')
    .select('id, name, routines:event_types(session, events(id))')
    .eq('subject_id', subjectId)
    .order('updated_at', { ascending: false })
    .order('order', { foreignTable: 'event_types' });

export type ListMissionsWithEventTypesAndEventsData = Awaited<
  ReturnType<typeof listMissionsWithRoutinesAndEvents>
>['data'];

export default listMissionsWithRoutinesAndEvents;
