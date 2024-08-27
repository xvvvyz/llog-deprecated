import EventPage from '@/_components/event-page';

interface PageProps {
  params: {
    eventId: string;
    subjectId: string;
  };
}

const Page = async ({ params: { eventId, subjectId } }: PageProps) => (
  <EventPage eventId={eventId} subjectId={subjectId} isPublic={true} />
);

export default Page;
