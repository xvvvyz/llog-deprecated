import getEvent from '@/_queries/get-event';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getPublicEvent = async (eventId: string) =>
  (await createServerSupabaseClient()).rpc('get_public_event', {
    public_event_id: eventId,
  }) as unknown as ReturnType<typeof getEvent>;

export default getPublicEvent;
