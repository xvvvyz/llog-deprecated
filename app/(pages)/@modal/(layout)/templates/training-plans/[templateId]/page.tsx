import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import TrainingPlanTemplateForm from '@/_components/training-plan-template-form';
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
    { data: availableModuleTemplates },
    { data: availableSessionTemplates },
    { data: subjects },
    { data: template },
  ] = await Promise.all([
    listInputs(),
    listTemplatesWithData({ type: TemplateType.Module }),
    listTemplatesWithData({ type: TemplateType.Session }),
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
      <PageModalHeader title="Edit training plan template" />
      <TrainingPlanTemplateForm
        availableInputs={availableInputs}
        availableModuleTemplates={availableModuleTemplates}
        availableSessionTemplates={availableSessionTemplates}
        subjects={subjects}
        template={template}
      />
    </Modal.Content>
  );
};

export default Page;
