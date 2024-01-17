import createServerComponentClient from '@/_server/create-server-component-client';
import listEvents from '@/_server/list-events';
import pageToRange from '@/_utilities/page-to-range';

const listPublicEvents = (
  subjectId: string,
  { page, size }: { page?: number; size?: number } = {},
) => {
  const [from_arg, to_arg] = pageToRange({ page, size });

  return createServerComponentClient().rpc('list_public_events', {
    from_arg,
    public_subject_id: subjectId,
    to_arg,
  }) as ReturnType<typeof listEvents>;
};

export default listPublicEvents;
