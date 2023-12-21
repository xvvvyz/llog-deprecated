import EventCard from '@/(account)/subjects/[subjectId]/_components/event-card';
import BackButton from '@/_components/back-button';
import Breadcrumbs from '@/_components/breadcrumbs';
import getCurrentTeamId from '@/_server/get-current-team-id';
import getCurrentUser from '@/_server/get-current-user';
import getEventTypeWithInputsAndOptions from '@/_server/get-event-type-with-inputs-and-options';
import getSubject from '@/_server/get-subject';
import formatTitle from '@/_utilities/format-title';

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

  if (!subject || !eventType || !user) return null;

  return (
    <>
      <div className="my-16 flex h-8 items-center justify-between gap-8 px-4">
        <BackButton href={`/subjects/${subjectId}`} />
        <Breadcrumbs
          items={[
            [subject.name, `/subjects/${subjectId}`],
            [eventType.name ?? ''],
          ]}
        />
      </div>
      <EventCard
        disabled={false}
        eventType={eventType}
        isTeamMember={subject.team_id === teamId}
        subjectId={subjectId}
        userId={user.id}
      />
    </>
  );
};

export default Page;
