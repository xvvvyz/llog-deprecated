import EventTypeForm from '@/_components/event-type-form';
import getEventTypeWithInputs from '@/_queries/get-event-type-with-inputs';
import getSubject from '@/_queries/get-subject';
import listInputsBySubjectId from '@/_queries/list-inputs-by-subject-id';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import listTemplatesWithData from '@/_queries/list-templates-with-data';
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
    { data: availableTemplates },
  ] = await Promise.all([
    getSubject(subjectId),
    getEventTypeWithInputs(eventTypeId),
    listInputsBySubjectId(subjectId),
    listSubjectsByTeamId(),
    listTemplatesWithData(),
  ]);

  if (
    !subject ||
    !eventType ||
    !availableInputs ||
    !subjects ||
    !availableTemplates
  ) {
    return null;
  }

  return (
    <EventTypeForm
      availableInputs={availableInputs}
      availableTemplates={availableTemplates}
      eventType={eventType}
      subjectId={subjectId}
      subjects={subjects}
    />
  );
};

export default Page;
