import Empty from '(components)/empty';
import firstIfArray from '(utilities)/first-if-array';
import { GetMissionData } from '(utilities)/get-mission';
import listSessionRoutines from '(utilities)/list-session-routines';
import EventCard from '../../../../../../(components)/event-card';

interface SessionProps {
  mission: NonNullable<GetMissionData>;
  sessionNumber: string;
  subjectId: string;
}

const Session = async ({ mission, sessionNumber, subjectId }: SessionProps) => {
  const { data: eventTypes } = await listSessionRoutines(
    mission.id,
    sessionNumber
  );

  if (!eventTypes?.length) return <Empty>No routines</Empty>;

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
          />
        );
      })}
    </div>
  );
};

export default Session;
