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
      profile:profiles(first_name, id, last_name),
      type:event_types(
        id,
        content,
        mission:missions(id, name),
        name,
        order,
        session,
        type
      )`
    )
    .eq('subject_id', subjectId)
    .order('created_at', { ascending: false })
    .order('created_at', { foreignTable: 'comments' });

export type ListEventsData = Awaited<ReturnType<typeof listEvents>>['data'];
export default listEvents;
