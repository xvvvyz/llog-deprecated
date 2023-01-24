import createServerSupabaseClient from './create-server-supabase-client';

const listMissionsWithRoutines = (subjectId: string) =>
  createServerSupabaseClient()
    .from('missions')
    .select('id, name, routines:event_types(session, events(id))')
    .eq('subject_id', subjectId)
    .not('routines.session', 'is', null)
    .order('updated_at', { ascending: false })
    .order('order', { foreignTable: 'event_types' });

export type ListMissionsWithEventTypesAndEventsData = Awaited<
  ReturnType<typeof listMissionsWithRoutines>
>['data'];

export default listMissionsWithRoutines;
