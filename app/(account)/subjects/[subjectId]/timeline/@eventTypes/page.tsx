import getCurrentTeamId from '@/(account)/_server/get-current-team-id';
import getSubject from '@/(account)/_server/get-subject';
import listSubjectEventTypes from '@/(account)/_server/list-subject-event-types';
import EventTypeList from '@/(account)/subjects/[subjectId]/timeline/@eventTypes/_components/event-type-list';

interface PageProps {
  params: {
    subjectId: string;
  };
}

const Page = async ({ params: { subjectId } }: PageProps) => {
  const [{ data: subject }, { data: eventTypes }, teamId] = await Promise.all([
    getSubject(subjectId),
    listSubjectEventTypes(subjectId),
    getCurrentTeamId(),
  ]);

  if (!subject || !eventTypes) return null;

  return (
    <EventTypeList
      eventTypes={eventTypes}
      isTeamMember={subject.team_id === teamId}
      subjectId={subjectId}
    />
  );
};

export default Page;
