import PageModalHeader from '@/_components/page-modal-header';
import SubjectForm from '@/_components/subject-form';
import formatTitle from '@/_utilities/format-title';
import { notFound } from 'next/navigation';

interface PageProps {
  searchParams: {
    back?: string;
  };
}

export const metadata = { title: formatTitle(['Subjects', 'Create']) };

const Page = ({ searchParams: { back } }: PageProps) => {
  if (!back) notFound();

  return (
    <>
      <PageModalHeader back={back} title="Create subject" />
      <SubjectForm back={back} />
    </>
  );
};

export default Page;
