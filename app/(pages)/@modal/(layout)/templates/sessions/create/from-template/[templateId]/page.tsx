import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import SessionTemplateForm from '@/_components/session-template-form';
import TemplateType from '@/_constants/enum-template-type';
import getTemplate from '@/_queries/get-template';
import listInputs from '@/_queries/list-inputs';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import listTemplates from '@/_queries/list-templates';

interface PageProps {
  params: Promise<{ templateId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { templateId } = await params;

  const [
    { data: availableInputs },
    { data: availableModuleTemplates },
    { data: subjects },
    { data: template },
  ] = await Promise.all([
    listInputs(),
    listTemplates({ type: TemplateType.Module }),
    listSubjectsByTeamId(),
    getTemplate(templateId),
  ]);

  if (!availableInputs || !availableModuleTemplates || !subjects || !template) {
    return null;
  }

  return (
    <Modal.Content>
      <PageModalHeader title="New session template" />
      <SessionTemplateForm
        availableInputs={availableInputs}
        availableModuleTemplates={availableModuleTemplates}
        isDuplicate
        subjects={subjects}
        template={template}
      />
    </Modal.Content>
  );
};

export default Page;
