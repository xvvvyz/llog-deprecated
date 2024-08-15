import * as Modal from '@/_components/modal';
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
    <Modal.Content>
      <PageModalHeader title="New training plan" />
      <TrainingPlanForm subjectId={subjectId} />
    </Modal.Content>
  );
};

export default Page;
