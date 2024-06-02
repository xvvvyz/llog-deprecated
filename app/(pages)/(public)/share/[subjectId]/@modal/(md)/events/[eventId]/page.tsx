import BackButton from '@/_components/back-button';
import EventCard from '@/_components/event-card';
import PageModalHeader from '@/_components/page-modal-header';
import getPublicEvent from '@/_queries/get-public-event';
import getPublicSubject from '@/_queries/get-public-subject';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: {
    eventId: string;
    subjectId: string;
  };
}

export const metadata = { title: formatTitle(['Subjects', 'Event']) };

const Page = async ({ params: { eventId, subjectId } }: PageProps) => {
  const [{ data: subject }, { data: event }] = await Promise.all([
    getPublicSubject(subjectId),
    getPublicEvent(eventId),
  ]);

  if (!subject || !event || !event?.type) return null;

  return (
    <>
      <PageModalHeader title={event.type.name as string} />
      <EventCard
        event={event}
        eventType={event.type}
        isPublic
        subjectId={subjectId}
      />
      <BackButton
        className="m-0 block w-full py-6 text-center"
        scroll={false}
        variant="link"
      >
        Close
      </BackButton>
    </>
  );
};

export default Page;
