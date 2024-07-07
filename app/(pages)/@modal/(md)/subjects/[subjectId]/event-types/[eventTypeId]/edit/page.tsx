import EventTypeForm from '@/_components/event-type-form';
import PageModalHeader from '@/_components/page-modal-header';
import getEventTypeWithInputs from '@/_queries/get-event-type-with-inputs';
import getSubject from '@/_queries/get-subject';
import listInputsBySubjectId from '@/_queries/list-inputs-by-subject-id';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: {
    eventTypeId: string;
    subjectId: string;
  };
}

export const metadata = {
  title: formatTitle(['Subjects', 'Event types', 'Edit']),
};

const Page = async ({ params: { eventTypeId, subjectId } }: PageProps) => {
  const [
    { data: subject },
    { data: eventType },
    { data: availableInputs },
    { data: subjects },
  ] = await Promise.all([
    getSubject(subjectId),
    getEventTypeWithInputs(eventTypeId),
    listInputsBySubjectId(subjectId),
    listSubjectsByTeamId(),
  ]);

  if (!subject || !eventType || !availableInputs || !subjects) {
    return null;
  }

  return (
    <>
      <PageModalHeader title={eventType.name as string} />
      <EventTypeForm
        availableInputs={availableInputs}
        eventType={eventType}
        subjects={subjects}
        subjectId={subjectId}
      />
    </>
  );
};

export default Page;
