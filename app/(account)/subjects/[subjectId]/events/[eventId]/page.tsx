import EventCard from '@/(account)/subjects/[subjectId]/_components/event-card';
import BackButton from '@/_components/back-button';
import Breadcrumbs from '@/_components/breadcrumbs';
import getCurrentTeamId from '@/_server/get-current-team-id';
import getCurrentUser from '@/_server/get-current-user';
import getEvent, { GetEventData } from '@/_server/get-event';
import getSubject from '@/_server/get-subject';
import firstIfArray from '@/_utilities/first-if-array';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: {
    eventId: string;
    subjectId: string;
  };
}

export const generateMetadata = async ({
  params: { eventId, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: event }] = await Promise.all([
    getSubject(subjectId),
    getEvent(eventId),
  ]);

  return {
    title: formatTitle([subject?.name, firstIfArray(event?.type)?.name]),
  };
};

export const revalidate = 0;

const Page = async ({ params: { eventId, subjectId } }: PageProps) => {
  const [{ data: subject }, { data: event }, user, teamId] = await Promise.all([
    getSubject(subjectId),
    getEvent(eventId),
    getCurrentUser(),
    getCurrentTeamId(),
  ]);

  if (!subject || !event || !user) return null;
  const eventType = firstIfArray(event.type);

  return (
    <>
      <div className="my-16 flex h-8 items-center justify-between gap-8 px-4">
        <BackButton href={`/subjects/${subjectId}`} />
        <Breadcrumbs
          items={[[subject.name, `/subjects/${subjectId}`], [eventType.name]]}
        />
      </div>
      <EventCard
        event={event as GetEventData}
        eventType={eventType}
        isTeamMember={subject.team_id === teamId}
        subjectId={subjectId}
        userId={user.id}
      />
    </>
  );
};

export default Page;
