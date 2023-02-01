import createServerSupabaseClient from './create-server-supabase-client';

const listEvents = (subjectId: string) =>
  createServerSupabaseClient()
    .from('events')
    .select(
      `
      comments(
        content,
        id,
        profile:profiles(first_name, id, last_name)
      ),
      created_at,
      id,
      inputs:event_inputs(
        input:inputs(id, label, type),
        option:input_options(id, label),
        value
      ),
      type:event_types(
        id,
        mission:missions(id, name),
        name,
        order,
        session
      )`
    )
    .order('created_at', { ascending: false })
    .order('created_at', { foreignTable: 'comments' })
    .eq('subject_id', subjectId);

export type ListEventsData = Awaited<ReturnType<typeof listEvents>>['data'];
export default listEvents;
