import firstIfArray from '(utilities)/first-if-array';
import getCurrentUser from '(utilities)/get-current-user';
import getEvent, { GetEventData } from '(utilities)/get-event';
import getSubject from '(utilities)/get-subject';
import { notFound } from 'next/navigation';
import EventCard from '../../../../(components)/event-card';
import EventModal from './(components)/event-modal';

interface PageProps {
  params: {
    eventId: string;
    subjectId: string;
  };
}

const Page = async ({ params: { eventId, subjectId } }: PageProps) => {
  const [{ data: subject }, { data: event }, user] = await Promise.all([
    getSubject(subjectId),
    getEvent(eventId),
    getCurrentUser(),
  ]);

  if (!subject || !event || !user) notFound();
  const eventType = firstIfArray(event.type);

  return (
    <EventModal content={eventType.content} title={eventType.name}>
      <EventCard
        className="border-0 bg-none"
        event={event as GetEventData}
        eventType={eventType}
        hideContent
        subjectId={subjectId}
        userId={user.id}
      />
    </EventModal>
  );
};

export const revalidate = 0;
export default Page;
