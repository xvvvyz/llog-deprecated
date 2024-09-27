import * as Modal from '@/_components/modal';
import ModuleTemplateForm from '@/_components/module-template-form';
import PageModalHeader from '@/_components/page-modal-header';
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
      <PageModalHeader title="New module template" />
      <ModuleTemplateForm
        availableInputs={availableInputs}
        isDuplicate
        subjects={subjects}
        template={template}
      />
    </Modal.Content>
  );
};

export default Page;
