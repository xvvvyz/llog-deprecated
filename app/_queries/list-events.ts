'use server';

import EventFilters from '@/_types/event-filters';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listEvents = async (
  subjectId: string,
  filters: Omit<EventFilters, 'pageSize'>,
) => {
  let q = (await createServerSupabaseClient())
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
          protocol:protocols(id, name),
          order,
          title
        ),
        name,
        order
      )`,
    )
    .eq('subject_id', subjectId);

  if (filters.startDate) q = q.gte('created_at', filters.startDate);
  if (filters.endDate) q = q.lt('created_at', filters.endDate);

  return q
    .order('created_at', { ascending: false })
    .order('created_at', { referencedTable: 'comments' })
    .order('order', { referencedTable: 'inputs' })
    .range(filters.from, filters.to);
};

export type ListEventsData = Awaited<ReturnType<typeof listEvents>>['data'];

export default listEvents;
