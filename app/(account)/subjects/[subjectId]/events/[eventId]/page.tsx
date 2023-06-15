import BackButton from '@/(account)/_components/back-button';
import Breadcrumbs from '@/(account)/_components/breadcrumbs';
import Header from '@/(account)/_components/header';
import getCurrentTeamId from '@/(account)/_server/get-current-team-id';
import getCurrentUser from '@/(account)/_server/get-current-user';
import getEvent, { GetEventData } from '@/(account)/_server/get-event';
import getSubject from '@/(account)/_server/get-subject';
import firstIfArray from '@/(account)/_utilities/first-if-array';
import formatTitle from '@/(account)/_utilities/format-title';
import EventCard from '@/(account)/subjects/[subjectId]/_components/event-card';
import { notFound } from 'next/navigation';

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

  if (!subject || !event || !user) notFound();
  const eventType = firstIfArray(event.type);

  return (
    <>
      <Header>
        <BackButton href={`/subjects/${subjectId}/timeline`} />
        <Breadcrumbs
          items={[
            [subject.name, `/subjects/${subjectId}/timeline`],
            [eventType.name],
          ]}
        />
      </Header>
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
