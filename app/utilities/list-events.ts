import createServerSupabaseClient from './create-server-supabase-client';

const listEvents = (subjectId: string) =>
  createServerSupabaseClient()
    .from('events')
    .select(
      `
      created_at,
      id,
      inputs:event_inputs(
        id,
        input:inputs(id, label, type),
        options:input_options(id, label),
        value
      ),
      type:event_types(
        id,
        mission:missions(id, name),
        name,
        session
      )`
    )
    .order('created_at', { ascending: false })
    .eq('subject_id', subjectId);

export type ListEvents = Awaited<ReturnType<typeof listEvents>>['data'];
export default listEvents;
