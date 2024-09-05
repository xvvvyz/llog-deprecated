import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import TrainingPlanForm from '@/_components/training-plan-form';
import TrainingPlanUseTemplateModal from '@/_components/training-plan-use-template-modal';
import TemplateType from '@/_constants/enum-template-type';
import getSubject from '@/_queries/get-subject';
import listTemplatesBySubjectIdAndType from '@/_queries/list-templates-by-subject-id-and-type';

interface PageProps {
  params: {
    subjectId: string;
  };
}

const Page = async ({ params: { subjectId } }: PageProps) => {
  const [{ data: availableTrainingPlanTemplates }, { data: subject }] =
    await Promise.all([
      listTemplatesBySubjectIdAndType({
        subjectId,
        type: TemplateType.TrainingPlan,
      }),
      getSubject(subjectId),
    ]);

  if (!availableTrainingPlanTemplates || !subject) return null;

  return (
    <Modal.Content>
      <PageModalHeader
        right={
          <TrainingPlanUseTemplateModal
            availableTrainingPlanTemplates={availableTrainingPlanTemplates}
            subjectId={subjectId}
          />
        }
        title="New training plan"
      />
      <TrainingPlanForm subjectId={subjectId} />
    </Modal.Content>
  );
};

export default Page;
