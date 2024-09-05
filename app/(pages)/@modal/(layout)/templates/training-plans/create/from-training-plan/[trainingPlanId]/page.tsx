import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import TrainingPlanTemplateForm from '@/_components/training-plan-template-form';
import TemplateType from '@/_constants/enum-template-type';
import getTrainingPlanForTemplate from '@/_queries/get-training-plan-for-template';
import listInputs from '@/_queries/list-inputs';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import listTemplates from '@/_queries/list-templates';

interface PageProps {
  params: {
    trainingPlanId: string;
  };
}

const Page = async ({ params: { trainingPlanId } }: PageProps) => {
  const [
    { data: availableInputs },
    { data: availableModuleTemplates },
    { data: availableSessionTemplates },
    { data: subjects },
    { data: trainingPlan },
  ] = await Promise.all([
    listInputs(),
    listTemplates({ type: TemplateType.Module }),
    listTemplates({ type: TemplateType.Session }),
    listSubjectsByTeamId(),
    getTrainingPlanForTemplate(trainingPlanId),
  ]);

  if (
    !availableInputs ||
    !availableModuleTemplates ||
    !availableSessionTemplates ||
    !subjects ||
    !trainingPlan
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
        disableCache
        isDuplicate
        subjects={subjects}
        template={{
          data: {
            sessions: trainingPlan.sessions.map((session) => ({
              modules: session.modules.map((module) => ({
                content: module.content,
                inputIds: module.inputs.map((input) => input.id),
                name: module.name,
              })),
              title: session.title,
            })),
          },
          name: trainingPlan.name ?? '',
        }}
      />
    </Modal.Content>
  );
};

export default Page;
