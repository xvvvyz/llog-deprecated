import EventTypeForm from '@/_components/event-type-form';
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

export const metadata = {
  title: formatTitle(['Subjects', 'Event types', 'New']),
};

const Page = async ({ params: { subjectId } }: PageProps) => {
  const [
    { data: subject },
    { data: availableInputs },
    { data: subjects },
    { data: availableTemplates },
  ] = await Promise.all([
    getSubject(subjectId),
    listInputsBySubjectId(subjectId),
    listSubjectsByTeamId(),
    listTemplatesWithData(),
  ]);

  if (!subject || !availableInputs || !subjects || !availableTemplates) {
    return null;
  }

  return (
    <EventTypeForm
      availableInputs={availableInputs}
      availableTemplates={availableTemplates}
      subjects={subjects}
      subjectId={subjectId}
    />
  );
};

export default Page;
