import Empty from '(components)/empty';
import Header from '(components)/header';
import getCurrentUser from '(utilities)/get-current-user';
import listEvents, { ListEventsData } from '(utilities)/list-events';
import getSubject from '../../../../../../(utilities)/get-subject';
import DownloadEventsButton from './download-events-button';
import TimelineEvents from './timeline-events';

interface PageProps {
  params: {
    subjectId: string;
  };
}

const Page = async ({ params: { subjectId } }: PageProps) => {
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

export const generateMetadata = async ({
  params: { subjectId },
}: PageProps) => {
  const { data: subject } = await getSubject(subjectId);
  if (!subject) return;
  return { title: subject.name };
};

export const revalidate = 0;
export default Page;
