import MissionForm from '@/_components/mission-form';
import PageModal from '@/_components/page-modal';
import PageModalHeader from '@/_components/page-modal-header';
import getSubject from '@/_queries/get-subject';
import formatTitle from '@/_utilities/format-title';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    subjectId: string;
  };
}

export const generateMetadata = async ({
  params: { subjectId },
}: PageProps) => {
  const { data: subject } = await getSubject(subjectId);
  return { title: formatTitle([subject?.name, 'Create training plan']) };
};

const Page = async ({ params: { subjectId } }: PageProps) => {
  const { data: subject } = await getSubject(subjectId);
  if (!subject) notFound();
  const back = `/subjects/${subjectId}`;

  return (
    <PageModal
      back={back}
      temporary_forcePath={`/subjects/${subjectId}/training-plans/create`}
    >
      <PageModalHeader back={back} title="Create training plan" />
      <MissionForm subjectId={subjectId} />
    </PageModal>
  );
};

export default Page;
