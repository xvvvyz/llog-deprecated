import Empty from '(components)/empty';
import getCurrentUser from '(utilities)/get-current-user';
import listEvents, { ListEventsData } from '(utilities)/list-events';
import TimelineEvents from './timeline-events';

interface TimelineProps {
  subjectId: string;
}

const Timeline = async ({ subjectId }: TimelineProps) => {
  const [{ data: events }, user] = await Promise.all([
    listEvents(subjectId),
    getCurrentUser(),
  ]);

  if (!events?.length || !user) return <Empty>No events</Empty>;

  return (
    <TimelineEvents
      events={events as ListEventsData}
      subjectId={subjectId}
      userId={user.id}
    />
  );
};

export default Timeline;
