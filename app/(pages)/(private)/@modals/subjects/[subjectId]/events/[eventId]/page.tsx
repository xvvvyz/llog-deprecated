import Button from '@/_components/button';
import EventCard from '@/_components/event-card';
import PageModal from '@/_components/page-modal';
import PageModalHeader from '@/_components/page-modal-header';
import getCurrentUserFromSession from '@/_queries/get-current-user-from-session';
import getEvent from '@/_queries/get-event';
import getSubject from '@/_queries/get-subject';
import formatTitle from '@/_utilities/format-title';
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

  return { title: formatTitle([subject?.name, event?.type?.name]) };
};

const Page = async ({ params: { eventId, subjectId } }: PageProps) => {
  const user = await getCurrentUserFromSession();

  const [{ data: subject }, { data: event }] = await Promise.all([
    getSubject(subjectId),
    getEvent(eventId),
  ]);

  if (!subject || !event || !event.type) notFound();
  const back = `/subjects/${subjectId}`;

  return (
    <PageModal
      back={back}
      temporary_forcePath={`/subjects/${subjectId}/events/${eventId}`}
    >
      <PageModalHeader back={back} title={event.type.name as string} />
      <EventCard
        event={event}
        eventType={event.type}
        isTeamMember={subject.team_id === user?.id}
        subjectId={subjectId}
        user={user}
      />
      <Button
        className="m-0 block w-full py-6 text-center"
        href={back}
        variant="link"
      >
        Close
      </Button>
    </PageModal>
  );
};

export default Page;
