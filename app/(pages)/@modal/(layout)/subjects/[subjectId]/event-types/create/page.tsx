import EventTypeForm from '@/_components/event-type-form';
import TemplateType from '@/_constants/enum-template-type';
import getSubject from '@/_queries/get-subject';
import listInputsBySubjectId from '@/_queries/list-inputs-by-subject-id';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import listTemplatesBySubjectIdAndType from '@/_queries/list-templates-by-subject-id-and-type';

interface PageProps {
  params: Promise<{ subjectId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { subjectId } = await params;

  const [
    { data: availableEventTypeTemplates },
    { data: availableInputs },
    { data: subject },
    { data: subjects },
  ] = await Promise.all([
    listTemplatesBySubjectIdAndType({
      subjectId,
      type: TemplateType.EventType,
    }),
    listInputsBySubjectId(subjectId),
    getSubject(subjectId),
    listSubjectsByTeamId(),
  ]);

  if (
    !availableEventTypeTemplates ||
    !availableInputs ||
    !subject ||
    !subjects
  ) {
    return null;
  }

  return (
    <EventTypeForm
      availableEventTypeTemplates={availableEventTypeTemplates}
      availableInputs={availableInputs}
      subjects={subjects}
      subjectId={subjectId}
    />
  );
};

export default Page;
