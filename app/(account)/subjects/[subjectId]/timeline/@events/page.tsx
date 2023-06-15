import Empty from '@/(account)/_components/empty';
import Header from '@/(account)/_components/header';
import getCurrentTeamId from '@/(account)/_server/get-current-team-id';
import getCurrentUser from '@/(account)/_server/get-current-user';
import getSubject from '@/(account)/_server/get-subject';
import listEvents, { ListEventsData } from '@/(account)/_server/list-events';
import DownloadEventsButton from '@/(account)/subjects/[subjectId]/timeline/@events/_components/download-events-button';
import TimelineEvents from '@/(account)/subjects/[subjectId]/timeline/@events/_components/timeline-events';

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

  return (
    <div className="mt-16">
      <Header className="mb-2">
        <h1 className="text-2xl">Timeline</h1>
        <DownloadEventsButton
          disabled={!events?.length}
          subjectId={subjectId}
        />
      </Header>
      {subject && events?.length && user ? (
        <TimelineEvents
          events={events as ListEventsData}
          isTeamMember={subject.team_id === teamId}
          subjectId={subjectId}
          userId={user.id}
        />
      ) : (
        <Empty>No events</Empty>
      )}
    </div>
  );
};

export default Page;
