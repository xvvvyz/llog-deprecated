import TimelineEvents from '@/(account)/subjects/[subjectId]/timeline/@events/_components/timeline-events';
import Empty from '@/_components/empty';
import getCurrentTeamId from '@/_server/get-current-team-id';
import getCurrentUser from '@/_server/get-current-user';
import getSubject from '@/_server/get-subject';
import listEvents, { ListEventsData } from '@/_server/list-events';
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

  if (!subject || !user || !events?.length) {
    return (
      <>
        <div className="mx-4 h-16 border-l-2 border-dashed border-alpha-2" />
        <Empty>
          <InformationCircleIcon className="w-7" />
          Recorded events will appear here.
        </Empty>
      </>
    );
  }

  return (
    <TimelineEvents
      events={events as ListEventsData}
      isTeamMember={subject.team_id === teamId}
      subjectId={subjectId}
      userId={user.id}
    />
  );
};

export default Page;
