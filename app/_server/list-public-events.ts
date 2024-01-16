import DEFAULT_PAGE_SIZE from '@/_constants/default-page-size';
import createServerComponentClient from '@/_server/create-server-component-client';
import listEvents from '@/_server/list-events';
import pageToRange from '@/_utilities/page-to-range';

const listPublicEvents = (
  subjectId: string,
  { page }: { page?: number } = {},
) => {
  const [from_arg, to_arg] = pageToRange({ page, size: DEFAULT_PAGE_SIZE });

  return createServerComponentClient().rpc('list_public_events', {
    from_arg,
    public_subject_id: subjectId,
    to_arg,
  }) as ReturnType<typeof listEvents>;
};

export default listPublicEvents;
