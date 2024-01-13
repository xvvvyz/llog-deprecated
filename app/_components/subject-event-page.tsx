import BackButton from '@/_components/back-button';
import Breadcrumbs from '@/_components/breadcrumbs';
import EventCard from '@/_components/event-card';
import getCurrentTeamId from '@/_server/get-current-team-id';
import getCurrentUser from '@/_server/get-current-user';
import getEvent from '@/_server/get-event';
import getPublicEvent from '@/_server/get-public-event';
import getPublicSubject from '@/_server/get-public-subject';
import getSubject from '@/_server/get-subject';
import firstIfArray from '@/_utilities/first-if-array';
import { notFound } from 'next/navigation';

interface SubjectEventPageProps {
  eventId: string;
  isPublic?: boolean;
  subjectId: string;
}

const Page = async ({
  eventId,
  isPublic,
  subjectId,
}: SubjectEventPageProps) => {
  const [{ data: subject }, { data: event }, user, teamId] = await Promise.all([
    isPublic ? getPublicSubject(subjectId) : getSubject(subjectId),
    isPublic ? getPublicEvent(eventId) : getEvent(eventId),
    getCurrentUser(),
    getCurrentTeamId(),
  ]);

  const eventType = firstIfArray(event?.type);
  if (!subject || !eventType) notFound();
  const shareOrSubjects = isPublic ? 'share' : 'subjects';

  return (
    <>
      <div className="my-16 flex h-8 items-center justify-between gap-8 px-4">
        <BackButton href={`/${shareOrSubjects}/${subjectId}`} />
        <Breadcrumbs
          items={[
            [subject.name, `/${shareOrSubjects}/${subjectId}`],
            [eventType.name ?? ''],
          ]}
        />
      </div>
      <EventCard
        disabled={false}
        event={event}
        eventType={eventType}
        isPublic={isPublic}
        isTeamMember={subject.team_id === teamId}
        subjectId={subjectId}
        user={user}
      />
    </>
  );
};

export default Page;
