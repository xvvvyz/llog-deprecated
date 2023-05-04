import Empty from '(components)/empty';
import Header from '(components)/header';
import getCurrentUser from '(utilities)/get-current-user';
import listEvents, { ListEventsData } from '(utilities)/list-events';
import DownloadEventsButton from './download-events-button';
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
    <div className="mt-16">
      <Header className="mb-2">
        <h1 className="text-2xl">Timeline</h1>
        <DownloadEventsButton subjectId={subjectId} />
      </Header>
      <TimelineEvents
        events={events as ListEventsData}
        subjectId={subjectId}
        userId={user.id}
      />
    </div>
  );
};

export default Timeline;
