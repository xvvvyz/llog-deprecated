import BackButton from '@/(account)/_components/back-button';
import Breadcrumbs from '@/(account)/_components/breadcrumbs';
import Header from '@/(account)/_components/header';
import getCurrentTeamId from '@/(account)/_server/get-current-team-id';
import getCurrentUser from '@/(account)/_server/get-current-user';
import getEventTypeWithInputsAndOptions from '@/(account)/_server/get-event-type-with-inputs-and-options';
import getSubject from '@/(account)/_server/get-subject';
import formatTitle from '@/(account)/_utilities/format-title';
import EventCard from '@/(account)/subjects/[subjectId]/_components/event-card';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    eventTypeId: string;
    subjectId: string;
  };
}

export const generateMetadata = async ({
  params: { eventTypeId, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: eventType }] = await Promise.all([
    getSubject(subjectId),
    getEventTypeWithInputsAndOptions(eventTypeId),
  ]);

  return {
    title: formatTitle([subject?.name, eventType?.name]),
  };
};

export const revalidate = 0;

const Page = async ({ params: { eventTypeId, subjectId } }: PageProps) => {
  const [{ data: subject }, { data: eventType }, user, teamId] =
    await Promise.all([
      getSubject(subjectId),
      getEventTypeWithInputsAndOptions(eventTypeId),
      getCurrentUser(),
      getCurrentTeamId(),
    ]);

  if (!subject || !eventType || !user) notFound();

  return (
    <>
      <Header>
        <BackButton href={`/subjects/${subjectId}/timeline`} />
        <Breadcrumbs
          items={[
            [subject.name, `/subjects/${subjectId}/timeline`],
            [eventType.name ?? ''],
          ]}
        />
      </Header>
      <EventCard
        eventType={eventType}
        isTeamMember={subject.team_id === teamId}
        subjectId={subjectId}
        userId={user.id}
      />
    </>
  );
};

export default Page;
