import MissionForm from '@/_components/mission-form';
import PageModalHeader from '@/_components/page-modal-header';
import getSubject from '@/_queries/get-subject';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: {
    subjectId: string;
  };
}

export const metadata = {
  title: formatTitle(['Subjects', 'Training plans', 'Create']),
};

const Page = async ({ params: { subjectId } }: PageProps) => {
  const { data: subject } = await getSubject(subjectId);
  if (!subject) return null;

  return (
    <>
      <PageModalHeader title="Create training plan" />
      <MissionForm subjectId={subjectId} />
    </>
  );
};

export default Page;
