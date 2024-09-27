import EventPage from '@/_components/event-page';

interface PageProps {
  params: Promise<{ eventId: string; subjectId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { eventId, subjectId } = await params;
  return <EventPage eventId={eventId} subjectId={subjectId} isPublic={true} />;
};

export default Page;
