import EventCard from '@/_components/event-card';
import PageModal from '@/_components/page-modal';
import PageModalHeader from '@/_components/page-modal-header';
import getPublicEvent from '@/_queries/get-public-event';
import getPublicSubject from '@/_queries/get-public-subject';
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
    getPublicSubject(subjectId),
    getPublicEvent(eventId),
  ]);

  return { title: formatTitle([subject?.name, event?.type?.name]) };
};

const Page = async ({ params: { eventId, subjectId } }: PageProps) => {
  const [{ data: subject }, { data: event }] = await Promise.all([
    getPublicSubject(subjectId),
    getPublicEvent(eventId),
  ]);

  if (!subject || !event || !event?.type) notFound();
  const back = `/share/${subjectId}`;

  return (
    <PageModal
      back={back}
      temporary_forcePath={`/share/${subjectId}/events/${eventId}`}
    >
      <PageModalHeader back={back} title={event.type.name as string} />
      <EventCard
        event={event}
        eventType={event.type}
        isPublic
        subjectId={subjectId}
      />
    </PageModal>
  );
};

export default Page;
