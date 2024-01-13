import createServerComponentClient from '@/_server/create-server-component-client';

const listEvents = (subjectId: string, { limit } = { limit: 50 }) => {
  const q = createServerComponentClient()
    .from('events')
    .select(
      `
      comments(
        content,
        created_at,
        id,
        profile:profiles(first_name, id, image_uri, last_name)
      ),
      created_at,
      id,
      inputs:event_inputs(
        input:inputs(id, label, type),
        option:input_options(id, label),
        value
      ),
      profile:profiles(first_name, id, image_uri, last_name),
      type:event_types(
        id,
        session:sessions(
          id,
          mission:missions(id, name),
          order
        ),
        name,
        order
      )`,
    )
    .eq('subject_id', subjectId)
    .order('created_at', { ascending: false })
    .order('created_at', { referencedTable: 'comments' })
    .order('order', { referencedTable: 'inputs' });

  if (limit) q.limit(limit);
  return q;
};

export type ListEventsData = Awaited<ReturnType<typeof listEvents>>['data'];

export default listEvents;
