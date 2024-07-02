import PageModalHeader from '@/_components/page-modal-header';
import SubjectForm from '@/_components/subject-form';
import getSubject from '@/_queries/get-subject';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: {
    subjectId: string;
  };
}

export const metadata = { title: formatTitle(['Subjects', 'Edit']) };

const Page = async ({ params: { subjectId } }: PageProps) => {
  const { data: subject } = await getSubject(subjectId);
  if (!subject) return null;

  return (
    <>
      <PageModalHeader title="Edit subject" />
      <SubjectForm subject={subject} />
    </>
  );
};

export default Page;
