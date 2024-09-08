import EventTypeTemplateForm from '@/_components/event-type-template-form';
import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import getTemplate from '@/_queries/get-template';
import listInputs from '@/_queries/list-inputs';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';

interface PageProps {
  params: {
    templateId: string;
  };
}

const Page = async ({ params: { templateId } }: PageProps) => {
  const [{ data: template }, { data: availableInputs }, { data: subjects }] =
    await Promise.all([
      getTemplate(templateId),
      listInputs(),
      listSubjectsByTeamId(),
    ]);

  if (!template || !availableInputs || !subjects) return null;

  return (
    <Modal.Content>
      <PageModalHeader title="New event type template" />
      <EventTypeTemplateForm
        availableInputs={availableInputs}
        isDuplicate
        subjects={subjects}
        template={template}
      />
    </Modal.Content>
  );
};

export default Page;
