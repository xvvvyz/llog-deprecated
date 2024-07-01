import EventCard from '@/_components/event-card';
import PageModalHeader from '@/_components/page-modal-header';
import getCurrentUser from '@/_queries/get-current-user';
import getEventTypeWithInputsAndOptions from '@/_queries/get-event-type-with-inputs-and-options';
import getSubject from '@/_queries/get-subject';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: {
    eventTypeId: string;
    subjectId: string;
  };
}

export const metadata = { title: formatTitle(['Subjects', 'Event']) };

const Page = async ({ params: { eventTypeId, subjectId } }: PageProps) => {
  const [{ data: subject }, { data: eventType }, user] = await Promise.all([
    getSubject(subjectId),
    getEventTypeWithInputsAndOptions(eventTypeId),
    getCurrentUser(),
  ]);

  if (!subject || !eventType) return null;

  return (
    <>
      <PageModalHeader title={eventType.name as string} />
      <EventCard
        eventType={eventType}
        isArchived={subject.archived}
        isTeamMember={!!user && subject.team_id === user.id}
        subjectId={subjectId}
        user={user}
      />
    </>
  );
};

export default Page;
