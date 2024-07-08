import PageModalHeader from '@/_components/page-modal-header';
import TrainingPlanForm from '@/_components/training-plan-form';
import getSubject from '@/_queries/get-subject';
import getTrainingPlan from '@/_queries/get-training-plan';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: {
    missionId: string;
    subjectId: string;
  };
}

export const metadata = {
  title: formatTitle(['Subjects', 'Training plans', 'Edit']),
};

const Page = async ({ params: { missionId, subjectId } }: PageProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getTrainingPlan(missionId),
  ]);

  if (!subject || !mission) return null;

  return (
    <>
      <PageModalHeader title={mission.name} />
      <TrainingPlanForm mission={mission} subjectId={subjectId} />
    </>
  );
};

export default Page;
