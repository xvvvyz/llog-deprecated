import getCurrentTeamId from '@/(account)/_server/get-current-team-id';
import getCurrentUser from '@/(account)/_server/get-current-user';
import getEvent, { GetEventData } from '@/(account)/_server/get-event';
import getSubject from '@/(account)/_server/get-subject';
import firstIfArray from '@/(account)/_utilities/first-if-array';
import EventCard from '@/(account)/subjects/[subjectId]/_components/event-card';
import EventModal from '@/(account)/subjects/[subjectId]/timeline/_@eventModal/(..)event/[eventId]/_components/event-modal';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    eventId: string;
    subjectId: string;
  };
}

const Page = async ({ params: { eventId, subjectId } }: PageProps) => {
  const [{ data: subject }, { data: event }, user, teamId] = await Promise.all([
    getSubject(subjectId),
    getEvent(eventId),
    getCurrentUser(),
    getCurrentTeamId(),
  ]);

  if (!subject || !event || !user) notFound();
  const eventType = firstIfArray(event.type);

  return (
    <EventModal
      content={eventType.content}
      subjectId={subjectId}
      title={eventType.name}
    >
      <EventCard
        className="border-0 bg-none"
        event={event as GetEventData}
        eventType={eventType}
        hideContent
        isTeamMember={subject.team_id === teamId}
        subjectId={subjectId}
        userId={user.id}
      />
    </EventModal>
  );
};

export default Page;
