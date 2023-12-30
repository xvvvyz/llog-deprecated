import TimelineEvents from '@/(account)/subjects/[subjectId]/_components/timeline-events';
import Empty from '@/_components/empty';
import listEvents, { ListEventsData } from '@/_server/list-events';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { User } from '@supabase/gotrue-js';

interface EventsProps {
  isTeamMember: boolean;
  subjectId: string;
  user: User;
}

const Events = async ({ isTeamMember, subjectId, user }: EventsProps) => {
  const { data: events } = await listEvents(subjectId);

  if (!events?.length) {
    return (
      <>
        <div className="mx-4 h-16 border-l-2 border-dashed border-alpha-2" />
        <Empty>
          <InformationCircleIcon className="w-7" />
          Recorded events will appear here.
        </Empty>
      </>
    );
  }

  return (
    <TimelineEvents
      events={events as ListEventsData}
      isTeamMember={isTeamMember}
      subjectId={subjectId}
      user={user}
    />
  );
};

export default Events;
