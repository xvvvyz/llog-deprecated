import createServerSupabaseClient from './create-server-supabase-client';

const listMissions = (subjectId: string) =>
  createServerSupabaseClient()
    .from('missions')
    .select('id, name, sessions(id, routines:event_types(events(id)))')
    .eq('subject_id', subjectId)
    .eq('deleted', false)
    .eq('sessions.deleted', false)
    .or(`scheduled_for.lte.${new Date().toISOString()},scheduled_for.is.null`, {
      foreignTable: 'sessions',
    })
    .order('order', { foreignTable: 'sessions' })
    .eq('sessions.routines.deleted', false)
    .order('name');

export type ListMissionsData = Awaited<ReturnType<typeof listMissions>>['data'];
export default listMissions;
