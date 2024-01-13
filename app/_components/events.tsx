import Empty from '@/_components/empty';
import TimelineEvents from '@/_components/timeline-events';
import listEvents from '@/_server/list-events';
import listPublicEvents from '@/_server/list-public-events';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { User } from '@supabase/supabase-js';

interface EventsProps {
  isPublic?: boolean;
  isTeamMember: boolean;
  subjectId: string;
  user: User | null;
}

const Events = async ({
  isPublic,
  isTeamMember,
  subjectId,
  user,
}: EventsProps) => {
  const { data: events } = isPublic
    ? await listPublicEvents(subjectId)
    : await listEvents(subjectId);

  if (!events?.length) {
    return (
      <>
        <div className="mx-4 h-16 border-l-2 border-dashed border-alpha-2" />
        <Empty className="mt-4">
          <InformationCircleIcon className="w-7" />
          Recorded events will appear here.
        </Empty>
      </>
    );
  }

  return (
    <div className="space-y-4">
      <TimelineEvents
        events={events}
        isPublic={isPublic}
        isTeamMember={isTeamMember}
        subjectId={subjectId}
        user={user}
      />
    </div>
  );
};

export default Events;
