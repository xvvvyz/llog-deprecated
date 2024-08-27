import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import TrainingPlanForm from '@/_components/training-plan-form';
import getSubject from '@/_queries/get-subject';
import getTrainingPlan from '@/_queries/get-training-plan';

interface PageProps {
  params: {
    missionId: string;
    subjectId: string;
  };
}

const Page = async ({ params: { missionId, subjectId } }: PageProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getTrainingPlan(missionId),
  ]);

  if (!subject || !mission) return null;

  return (
    <Modal.Content>
      <PageModalHeader title="Edit training plan name" />
      <TrainingPlanForm mission={mission} subjectId={subjectId} />
    </Modal.Content>
  );
};

export default Page;
