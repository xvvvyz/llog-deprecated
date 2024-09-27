'use server';

import listEvents from '@/_queries/list-events';
import EventFilters from '@/_types/event-filters';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listPublicEvents = async (
  subjectId: string,
  { endDate, from, startDate, to }: Omit<EventFilters, 'pageSize'>,
) =>
  (await createServerSupabaseClient()).rpc('list_public_events', {
    end_date: endDate,
    from_arg: from,
    public_subject_id: subjectId,
    start_date: startDate,
    to_arg: to,
  }) as unknown as ReturnType<typeof listEvents>;

export default listPublicEvents;
