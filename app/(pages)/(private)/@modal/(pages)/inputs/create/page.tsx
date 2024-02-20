import InputForm from '@/_components/input-form';
import PageModalHeader from '@/_components/page-modal-header';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import formatTitle from '@/_utilities/format-title';
import { notFound } from 'next/navigation';

interface PageProps {
  searchParams: {
    back?: string;
  };
}

export const metadata = { title: formatTitle(['Inputs', 'Create']) };

const Page = async ({ searchParams: { back } }: PageProps) => {
  if (!back) notFound();
  const { data: subjects } = await listSubjectsByTeamId();
  if (!subjects) notFound();

  return (
    <>
      <PageModalHeader back={back} title="Create input" />
      <InputForm back={back} subjects={subjects} />
    </>
  );
};

export default Page;
