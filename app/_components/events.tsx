import listEvents from '@/_actions/list-events';
import Empty from '@/_components/empty';
import TimelineEvents from '@/_components/timeline-events';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';
import { User } from '@supabase/supabase-js';

interface EventsProps {
  isPublic?: boolean;
  isTeamMember: boolean;
  subjectId: string;
  to?: string;
  user?: User;
}

const Events = async ({
  isPublic,
  isTeamMember,
  subjectId,
  to,
  user,
}: EventsProps) => {
  const pageSize = 25;
  const toNumber = to ? Number(to) : pageSize - 1;

  const { data: events } = await listEvents({
    from: 0,
    isPublic,
    subjectId,
    to: toNumber,
  });

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
    <TimelineEvents
      events={events}
      isPublic={isPublic}
      isTeamMember={isTeamMember}
      pageSize={pageSize}
      subjectId={subjectId}
      to={toNumber}
      user={user}
    />
  );
};

export default Events;
