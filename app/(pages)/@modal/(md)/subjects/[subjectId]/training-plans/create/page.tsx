import PageModalHeader from '@/_components/page-modal-header';
import TrainingPlanForm from '@/_components/training-plan-form';
import getSubject from '@/_queries/get-subject';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: {
    subjectId: string;
  };
}

export const metadata = {
  title: formatTitle(['Subjects', 'Training plans', 'New']),
};

const Page = async ({ params: { subjectId } }: PageProps) => {
  const { data: subject } = await getSubject(subjectId);
  if (!subject) return null;

  return (
    <>
      <PageModalHeader title="New training plan" />
      <TrainingPlanForm subjectId={subjectId} />
    </>
  );
};

export default Page;
