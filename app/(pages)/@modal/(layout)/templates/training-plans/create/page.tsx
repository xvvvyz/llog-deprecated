import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import TrainingPlanTemplateForm from '@/_components/training-plan-template-form';
import TemplateType from '@/_constants/enum-template-type';
import listInputs from '@/_queries/list-inputs';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import listTemplates from '@/_queries/list-templates';

const Page = async () => {
  const [
    { data: availableInputs },
    { data: availableModuleTemplates },
    { data: availableSessionTemplates },
    { data: subjects },
  ] = await Promise.all([
    listInputs(),
    listTemplates({ type: TemplateType.Module }),
    listTemplates({ type: TemplateType.Session }),
    listSubjectsByTeamId(),
  ]);

  if (
    !availableInputs ||
    !availableModuleTemplates ||
    !availableSessionTemplates ||
    !subjects
  ) {
    return null;
  }

  return (
    <Modal.Content>
      <PageModalHeader title="New training plan template" />
      <TrainingPlanTemplateForm
        availableInputs={availableInputs}
        availableModuleTemplates={availableModuleTemplates}
        availableSessionTemplates={availableSessionTemplates}
        subjects={subjects}
      />
    </Modal.Content>
  );
};

export default Page;
