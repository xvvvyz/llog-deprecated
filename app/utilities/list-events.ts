import createServerSupabaseClient from './create-server-supabase-client';

const listEvents = (subjectId: string) =>
  createServerSupabaseClient()
    .from('events')
    .select(
      'created_at, id, event_inputs(id, value, input:inputs(id, label, type), input_option:input_options(id, label)), observation:observations(id, name), routine:routines(id, mission_id, name, session)'
    )
    .order('created_at', { ascending: false })
    .eq('subject_id', subjectId);

export type ListEvents = Awaited<ReturnType<typeof listEvents>>['data'];
export default listEvents;
