import Events from '@/_components/events';
import getCurrentUserFromSession from '@/_queries/get-current-user-from-session';
import getPublicSubject from '@/_queries/get-public-subject';
import getSubject from '@/_queries/get-subject';

interface SubjectPageProps {
  eventsTo?: string;
  isPublic?: boolean;
  subjectId: string;
}

const SubjectEventsPage = async ({
  eventsTo,
  isPublic,
  subjectId,
}: SubjectPageProps) => {
  const user = await getCurrentUserFromSession();

  const { data: subject } = await (isPublic
    ? getPublicSubject(subjectId)
    : getSubject(subjectId));

  if (!subject) return null;
  const isTeamMember = subject.team_id === user?.id;

  return (
    <Events
      isPublic={isPublic}
      isTeamMember={isTeamMember}
      subjectId={subjectId}
      to={eventsTo}
      user={user}
    />
  );
};

export default SubjectEventsPage;
