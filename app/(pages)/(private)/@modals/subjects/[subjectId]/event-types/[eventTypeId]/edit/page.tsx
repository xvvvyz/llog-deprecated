import EventTypeForm from '@/_components/event-type-form';
import PageModal from '@/_components/page-modal';
import PageModalHeader from '@/_components/page-modal-header';
import getEventTypeWithInputs from '@/_queries/get-event-type-with-inputs';
import getSubject from '@/_queries/get-subject';
import listInputsBySubjectId from '@/_queries/list-inputs-by-subject-id';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import listTemplatesWithData from '@/_queries/list-templates-with-data';
import formatTitle from '@/_utilities/format-title';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    eventTypeId: string;
    subjectId: string;
  };
}

export const generateMetadata = async ({
  params: { eventTypeId, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: eventType }] = await Promise.all([
    getSubject(subjectId),
    getEventTypeWithInputs(eventTypeId),
  ]);

  return { title: formatTitle([subject?.name, eventType?.name, 'Edit']) };
};

const Page = async ({ params: { eventTypeId, subjectId } }: PageProps) => {
  const [
    { data: subject },
    { data: eventType },
    { data: availableInputs },
    { data: availableTemplates },
    { data: subjects },
  ] = await Promise.all([
    getSubject(subjectId),
    getEventTypeWithInputs(eventTypeId),
    listInputsBySubjectId(subjectId),
    listTemplatesWithData(),
    listSubjectsByTeamId(),
  ]);

  if (
    !subject ||
    !eventType ||
    !availableInputs ||
    !availableTemplates ||
    !subjects
  ) {
    notFound();
  }

  const back = `/subjects/${subjectId}`;

  return (
    <PageModal
      back={back}
      temporary_forcePath={`/subjects/${subjectId}/event-types/${eventTypeId}/edit`}
    >
      <PageModalHeader back={back} title={eventType.name as string} />
      <EventTypeForm
        availableInputs={availableInputs}
        availableTemplates={availableTemplates}
        eventType={eventType}
        subjects={subjects}
        subjectId={subjectId}
      />
    </PageModal>
  );
};

export default Page;
