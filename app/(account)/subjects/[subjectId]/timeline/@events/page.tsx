import Empty from '@/(account)/_components/empty';
import Header from '@/(account)/_components/header';
import getCurrentTeamId from '@/(account)/_server/get-current-team-id';
import getCurrentUser from '@/(account)/_server/get-current-user';
import getSubject from '@/(account)/_server/get-subject';
import listEvents, { ListEventsData } from '@/(account)/_server/list-events';
import DownloadEventsButton from './_components/download-events-button';
import TimelineEvents from './_components/timeline-events';

interface PageProps {
  params: {
    subjectId: string;
  };
}

const Page = async ({ params: { subjectId } }: PageProps) => {
  const [{ data: subject }, { data: events }, user, teamId] = await Promise.all(
    [
      getSubject(subjectId),
      listEvents(subjectId),
      getCurrentUser(),
      getCurrentTeamId(),
    ]
  );

  if (!subject || !events?.length || !user || !teamId) {
    return <Empty>No events</Empty>;
  }

  return (
    <div className="mt-16">
      <Header className="mb-2">
        <h1 className="text-2xl">Timeline</h1>
        <DownloadEventsButton subjectId={subjectId} />
      </Header>
      <TimelineEvents
        events={events as ListEventsData}
        isTeamMember={subject.team_id === teamId}
        subjectId={subjectId}
        userId={user.id}
      />
    </div>
  );
};

export default Page;
