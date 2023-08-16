import Empty from '@/(account)/_components/empty';
import Header from '@/(account)/_components/header';
import getCurrentTeamId from '@/(account)/_server/get-current-team-id';
import getCurrentUser from '@/(account)/_server/get-current-user';
import getSubject from '@/(account)/_server/get-subject';
import listEvents, { ListEventsData } from '@/(account)/_server/list-events';
import DownloadEventsButton from '@/(account)/subjects/[subjectId]/timeline/@events/_components/download-events-button';
import TimelineEvents from '@/(account)/subjects/[subjectId]/timeline/@events/_components/timeline-events';

import InsightsButton from '@/(account)/subjects/[subjectId]/timeline/@events/_components/insights-button';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

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
    ],
  );

  if (!subject || !user) return null;

  return (
    <>
      <Header className="mb-2">
        <h1 className="text-2xl">Timeline</h1>
        <div className="divide-x divide-alpha-1">
          {subject.team_id === teamId && (
            <InsightsButton
              disabled={!events?.length}
              subjectId={subject.id}
              user={user}
            />
          )}
          <DownloadEventsButton
            className={subject.team_id === teamId ? 'rounded-l-none' : ''}
            disabled={!events?.length}
            subjectId={subjectId}
          >
            {subject.team_id === teamId ? 'Events' : 'Download events'}
          </DownloadEventsButton>
        </div>
      </Header>
      {events?.length ? (
        <TimelineEvents
          events={events as ListEventsData}
          isTeamMember={subject.team_id === teamId}
          subjectId={subjectId}
          userId={user.id}
        />
      ) : (
        <div className="space-y-4 px-4">
          <div className="mx-4 h-16 border-l-2 border-dashed border-alpha-2" />
          <Empty>
            <InformationCircleIcon className="w-7" />
            Recorded events will appear here.
          </Empty>
        </div>
      )}
    </>
  );
};

export default Page;
