import EventTypeForm from '@/_components/event-type-form';
import PageModalHeader from '@/_components/page-modal-header';
import getSubject from '@/_queries/get-subject';
import listInputsBySubjectId from '@/_queries/list-inputs-by-subject-id';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import listTemplatesWithData from '@/_queries/list-templates-with-data';
import formatTitle from '@/_utilities/format-title';

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
    return null;
  }

  return (
    <>
      <PageModalHeader title="Create event type" />
      <EventTypeForm
        availableInputs={availableInputs}
        availableTemplates={availableTemplates}
        subjects={subjects}
        subjectId={subjectId}
      />
    </>
  );
};

export default Page;
