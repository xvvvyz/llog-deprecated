import getEvent from '@/_queries/get-event';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getPublicEvent = (eventId: string) =>
  createServerSupabaseClient().rpc('get_public_event', {
    public_event_id: eventId,
  }) as ReturnType<typeof getEvent>;

export default getPublicEvent;
