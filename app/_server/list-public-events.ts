import createServerComponentClient from '@/_server/create-server-component-client';
import listEvents from '@/_server/list-events';

const listPublicEvents = (subjectId: string, { limit } = { limit: 50 }) =>
  createServerComponentClient().rpc('list_public_events', {
    limit_count: limit,
    public_subject_id: subjectId,
  }) as ReturnType<typeof listEvents>;

export default listPublicEvents;
