import Empty from '(components)/empty';
import firstIfArray from '(utilities)/first-if-array';
import getCurrentUser from '(utilities)/get-current-user';
import { GetMissionData } from '(utilities)/get-mission';
import listSessionRoutines from '(utilities)/list-session-routines';
import EventCard from '../../../../../../(components)/event-card';

interface SessionProps {
  mission: NonNullable<GetMissionData>;
  sessionNumber: string;
  subjectId: string;
}

const Session = async ({ mission, sessionNumber, subjectId }: SessionProps) => {
  const [{ data: eventTypes }, user] = await Promise.all([
    listSessionRoutines(mission.id, sessionNumber),
    getCurrentUser(),
  ]);

  if (!eventTypes?.length || !user) return <Empty>No routines</Empty>;

  return (
    <div className="flex flex-col gap-16 sm:gap-4">
      {eventTypes.map((eventType) => {
        const event = firstIfArray(eventType.event);

        return (
          <EventCard
            event={event}
            eventType={eventType}
            key={eventType.id}
            mission={mission}
            subjectId={subjectId}
            userId={user.id}
          />
        );
      })}
    </div>
  );
};

export default Session;
