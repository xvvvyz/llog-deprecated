import * as Modal from '@/_components/modal';
import ProtocolTemplateForm from '@/_components/protocol-template-form';
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
    { data: availableSessionTemplates },
    { data: subjects },
    { data: template },
  ] = await Promise.all([
    listInputs(),
    listTemplates({ type: TemplateType.Module }),
    listTemplates({ type: TemplateType.Session }),
    listSubjectsByTeamId(),
    getTemplate(templateId),
  ]);

  if (
    !availableInputs ||
    !availableModuleTemplates ||
    !availableSessionTemplates ||
    !subjects ||
    !template
  ) {
    return null;
  }

  return (
    <Modal.Content>
      <ProtocolTemplateForm
        availableInputs={availableInputs}
        availableModuleTemplates={availableModuleTemplates}
        availableSessionTemplates={availableSessionTemplates}
        isDuplicate
        subjects={subjects}
        template={template}
        title="New protocol template"
      />
    </Modal.Content>
  );
};

export default Page;
