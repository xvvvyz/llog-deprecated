import PageModalHeader from '@/_components/page-modal-header';
import SubjectForm from '@/_components/subject-form';
import getSubject from '@/_queries/get-subject';
import formatTitle from '@/_utilities/format-title';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    subjectId: string;
  };
  searchParams: {
    back?: string;
  };
}

export const generateMetadata = async ({
  params: { subjectId },
}: PageProps) => {
  const { data: subject } = await getSubject(subjectId);
  return { title: formatTitle([subject?.name, 'Edit']) };
};

const Page = async ({
  params: { subjectId },
  searchParams: { back },
}: PageProps) => {
  if (!back) notFound();
  const { data: subject } = await getSubject(subjectId);
  if (!subject) notFound();

  return (
    <>
      <PageModalHeader title="Edit subject" />
      <SubjectForm subject={subject} />
    </>
  );
};

export default Page;
