import Empty from '@/_components/empty';
import TimelineEvents from '@/_components/timeline-events';
import getCurrentUser from '@/_queries/get-current-user';
import getPublicSubject from '@/_queries/get-public-subject';
import getSubject from '@/_queries/get-subject';
import listEvents from '@/_queries/list-events';
import listPublicEvents from '@/_queries/list-public-events';
import formatEventFilters from '@/_utilities/format-event-filters';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';

interface SubjectEventsPageProps {
  from?: string;
  limit?: string;
  isPublic?: boolean;
  subjectId: string;
  to?: string;
}

const SubjectEventsPage = async ({
  from,
  limit,
  isPublic,
  subjectId,
  to,
}: SubjectEventsPageProps) => {
  const f = formatEventFilters({ from, limit, to });

  const [{ data: subject }, { data: events }, user] = await Promise.all([
    isPublic ? getPublicSubject(subjectId) : getSubject(subjectId),
    isPublic
      ? await listPublicEvents(subjectId, f)
      : await listEvents(subjectId, f),
    getCurrentUser(),
  ]);

  if (!subject) return null;

  if (!events?.length) {
    return (
      <>
        <div className="mx-4 h-16 border-l-2 border-dashed border-alpha-2" />
        <Empty className="mt-4">
          <InformationCircleIcon className="w-7" />
          No events
        </Empty>
      </>
    );
  }

  return (
    <TimelineEvents
      events={events}
      filters={f}
      isPublic={isPublic}
      isTeamMember={!!user && subject.team_id === user.id}
      subjectId={subjectId}
      user={user}
    />
  );
};

export default SubjectEventsPage;
