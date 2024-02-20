import InputForm from '@/_components/input-form';
import PageModalHeader from '@/_components/page-modal-header';
import getInput from '@/_queries/get-input';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import formatTitle from '@/_utilities/format-title';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    inputId: string;
  };
  searchParams: {
    back?: string;
  };
}

export const metadata = { title: formatTitle(['Inputs', 'Create']) };

const Page = async ({
  params: { inputId },
  searchParams: { back },
}: PageProps) => {
  if (!back) notFound();

  const [{ data: subjects }, { data: input }] = await Promise.all([
    listSubjectsByTeamId(),
    getInput(inputId),
  ]);

  if (!input || !subjects) notFound();

  return (
    <>
      <PageModalHeader back={back} title="Create input" />
      <InputForm back={back} input={input} isDuplicate subjects={subjects} />
    </>
  );
};

export default Page;
