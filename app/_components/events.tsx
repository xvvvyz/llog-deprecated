import Empty from '@/_components/empty';
import TimelineEvents from '@/_components/timeline-events';
import listEvents from '@/_queries/list-events';
import listPublicEvents from '@/_queries/list-public-events';
import EventFilters from '@/_types/event-filters';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';
import { User } from '@supabase/supabase-js';

interface EventsProps {
  filters: EventFilters;
  isPublic?: boolean;
  isTeamMember: boolean;
  subjectId: string;
  user?: User;
}

const Events = async ({
  filters,
  isPublic,
  isTeamMember,
  subjectId,
  user,
}: EventsProps) => {
  const { data: events, error } = isPublic
    ? await listPublicEvents(subjectId, filters)
    : await listEvents(subjectId, filters);
  console.log(error);

  if (!events?.length) {
    return (
      <>
        <div className="mx-4 h-16 border-l-2 border-dashed border-alpha-2" />
        <Empty className="mt-4">
          <InformationCircleIcon className="w-7" />
          No events.
        </Empty>
      </>
    );
  }

  return (
    <TimelineEvents
      events={events}
      filters={filters}
      isPublic={isPublic}
      isTeamMember={isTeamMember}
      subjectId={subjectId}
      user={user}
    />
  );
};

export default Events;
