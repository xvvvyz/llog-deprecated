import Empty from '(components)/empty';
import listEvents from '(utilities)/list-events';
import TimelineEvents from './timeline-events';

interface TimelineProps {
  subjectId: string;
}

const Timeline = async ({ subjectId }: TimelineProps) => {
  const { data: events } = await listEvents(subjectId);
  if (!events?.length) return <Empty>No events</Empty>;
  return <TimelineEvents events={events} subjectId={subjectId} />;
};

export default Timeline;
