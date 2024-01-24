'use server';

import le from '@/_queries/list-events';
import listPublicEvents from '@/_queries/list-public-events';

const listEvents = async ({
  from,
  isPublic,
  subjectId,
  to,
}: {
  from: number;
  isPublic?: boolean;
  subjectId: string;
  to: number;
}) =>
  isPublic
    ? await listPublicEvents(subjectId, { from, to })
    : await le(subjectId, { from, to });

export default listEvents;
