import EventTypeTemplateForm from '@/_components/event-type-template-form';
import * as Modal from '@/_components/modal';
import getTemplate from '@/_queries/get-template';
import listInputs from '@/_queries/list-inputs';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';

interface PageProps {
  params: Promise<{ templateId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { templateId } = await params;

  const [{ data: template }, { data: availableInputs }, { data: subjects }] =
    await Promise.all([
      getTemplate(templateId),
      listInputs(),
      listSubjectsByTeamId(),
    ]);

  if (!template || !availableInputs || !subjects) return null;

  return (
    <Modal.Content>
      <EventTypeTemplateForm
        availableInputs={availableInputs}
        subjects={subjects}
        template={template}
        title="Edit event type template"
      />
    </Modal.Content>
  );
};

export default Page;
