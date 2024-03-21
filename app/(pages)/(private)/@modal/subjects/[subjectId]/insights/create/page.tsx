import InsightForm from '@/_components/insight-form';
import PageModalHeader from '@/_components/page-modal-header';
import getSubject from '@/_queries/get-subject';
import listInputsBySubjectId from '@/_queries/list-inputs-by-subject-id';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: {
    subjectId: string;
  };
}

export const generateMetadata = async ({
  params: { subjectId },
}: PageProps) => {
  const { data: subject } = await getSubject(subjectId);
  return { title: formatTitle([subject?.name, 'Create insight']) };
};

const Page = async ({ params: { subjectId } }: PageProps) => {
  const [{ data: availableInputs }] = await Promise.all([
    listInputsBySubjectId(subjectId),
  ]);

  if (!availableInputs) {
    return null;
  }

  return (
    <>
      <PageModalHeader title="Create insight" />
      <InsightForm availableInputs={availableInputs} subjectId={subjectId} />
    </>
  );
};

export default Page;
