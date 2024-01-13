import createServerComponentClient from '@/_server/create-server-component-client';
import getEvent from '@/_server/get-event';

const getPublicEvent = (eventId: string) =>
  createServerComponentClient().rpc('get_public_event', {
    public_event_id: eventId,
  }) as ReturnType<typeof getEvent>;

export default getPublicEvent;
