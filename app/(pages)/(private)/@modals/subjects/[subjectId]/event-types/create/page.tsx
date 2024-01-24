import EventTypeForm from '@/_components/event-type-form';
import PageModal from '@/_components/page-modal';
import PageModalHeader from '@/_components/page-modal-header';
import getSubject from '@/_queries/get-subject';
import listInputsBySubjectId from '@/_queries/list-inputs-by-subject-id';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import listTemplatesWithData from '@/_queries/list-templates-with-data';
import formatTitle from '@/_utilities/format-title';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    subjectId: string;
  };
}

export const generateMetadata = async ({
  params: { subjectId },
}: PageProps) => {
  const { data: subject } = await getSubject(subjectId);
  return { title: formatTitle([subject?.name, 'Create event type']) };
};

const Page = async ({ params: { subjectId } }: PageProps) => {
  const [
    { data: subject },
    { data: availableInputs },
    { data: availableTemplates },
    { data: subjects },
  ] = await Promise.all([
    getSubject(subjectId),
    listInputsBySubjectId(subjectId),
    listTemplatesWithData(),
    listSubjectsByTeamId(),
  ]);

  if (!subject || !availableInputs || !availableTemplates || !subjects) {
    notFound();
  }

  const back = `/subjects/${subjectId}`;

  return (
    <PageModal
      back={back}
      temporary_forcePath={`/subjects/${subjectId}/event-types/create`}
    >
      <PageModalHeader back={back} title="Create event type" />
      <EventTypeForm
        availableInputs={availableInputs}
        availableTemplates={availableTemplates}
        subjects={subjects}
        subjectId={subjectId}
      />
    </PageModal>
  );
};

export default Page;
