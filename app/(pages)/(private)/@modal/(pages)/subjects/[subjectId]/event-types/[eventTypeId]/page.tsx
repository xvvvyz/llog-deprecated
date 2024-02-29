import EventCard from '@/_components/event-card';
import PageModalHeader from '@/_components/page-modal-header';
import getCurrentUserFromSession from '@/_queries/get-current-user-from-session';
import getEventTypeWithInputsAndOptions from '@/_queries/get-event-type-with-inputs-and-options';
import getSubject from '@/_queries/get-subject';
import formatTitle from '@/_utilities/format-title';
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

  return { title: formatTitle([subject?.name, eventType?.name]) };
};

const Page = async ({ params: { eventTypeId, subjectId } }: PageProps) => {
  const user = await getCurrentUserFromSession();

  const [{ data: subject }, { data: eventType }] = await Promise.all([
    getSubject(subjectId),
    getEventTypeWithInputsAndOptions(eventTypeId),
  ]);

  if (!subject || !eventType) notFound();

  return (
    <>
      <PageModalHeader title={eventType.name as string} />
      <EventCard
        eventType={eventType}
        isTeamMember={subject.team_id === user?.id}
        subjectId={subjectId}
        user={user}
      />
    </>
  );
};

export default Page;
