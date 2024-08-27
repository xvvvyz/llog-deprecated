import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import TrainingPlanForm from '@/_components/training-plan-form';
import TrainingPlanUseTemplateModal from '@/_components/training-plan-use-template-modal';
import getSubject from '@/_queries/get-subject';

interface PageProps {
  params: {
    subjectId: string;
  };
}

const Page = async ({ params: { subjectId } }: PageProps) => {
  const { data: subject } = await getSubject(subjectId);
  if (!subject) return null;

  return (
    <Modal.Content>
      <PageModalHeader
        right={<TrainingPlanUseTemplateModal />}
        title="New training plan"
      />
      <TrainingPlanForm subjectId={subjectId} />
    </Modal.Content>
  );
};

export default Page;
