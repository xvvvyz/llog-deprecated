import EventPage from '@/_components/event-page';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: {
    eventId: string;
    subjectId: string;
  };
}

export const metadata = { title: formatTitle(['Subjects', 'Event']) };

const Page = async ({ params: { eventId, subjectId } }: PageProps) => (
  <EventPage eventId={eventId} subjectId={subjectId} isPublic={true} />
);

export default Page;
