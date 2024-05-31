import BackButton from '@/_components/back-button';
import EventCard from '@/_components/event-card';
import PageModalHeader from '@/_components/page-modal-header';
import getCurrentUser from '@/_queries/get-current-user';
import getEvent from '@/_queries/get-event';
import getSubject from '@/_queries/get-subject';
import firstIfArray from '@/_utilities/first-if-array';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: {
    eventId: string;
    subjectId: string;
  };
}

export const metadata = { title: formatTitle(['Subjects', 'Event']) };

const Page = async ({ params: { eventId, subjectId } }: PageProps) => {
  const [{ data: subject }, { data: event }, user] = await Promise.all([
    getSubject(subjectId),
    getEvent(eventId),
    getCurrentUser(),
  ]);

  if (!subject || !event || !event.type) return null;

  return (
    <>
      <PageModalHeader title={firstIfArray(event.type).name as string} />
      <EventCard
        event={event}
        eventType={event.type}
        isTeamMember={!!user && subject.team_id === user.id}
        subjectId={subjectId}
        user={user}
      />
      <BackButton className="m-0 block w-full py-6 text-center" variant="link">
        Close
      </BackButton>
    </>
  );
};

export default Page;
