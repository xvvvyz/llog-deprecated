import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import SessionTemplateForm from '@/_components/session-template-form';
import TemplateType from '@/_constants/enum-template-type';
import getTemplate from '@/_queries/get-template';
import listInputs from '@/_queries/list-inputs';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import listTemplatesWithData from '@/_queries/list-templates-with-data';

interface PageProps {
  params: {
    templateId: string;
  };
}

const Page = async ({ params: { templateId } }: PageProps) => {
  const [
    { data: availableInputs },
    { data: availableTemplates },
    { data: subjects },
    { data: template },
  ] = await Promise.all([
    listInputs(),
    listTemplatesWithData({ type: TemplateType.Module }),
    listSubjectsByTeamId(),
    getTemplate(templateId),
  ]);

  if (!availableInputs || !availableTemplates || !subjects || !template) {
    return null;
  }

  return (
    <Modal.Content>
      <PageModalHeader title="Edit session template" />
      <SessionTemplateForm
        availableInputs={availableInputs}
        availableTemplates={availableTemplates}
        subjects={subjects}
        template={template}
      />
    </Modal.Content>
  );
};

export default Page;
