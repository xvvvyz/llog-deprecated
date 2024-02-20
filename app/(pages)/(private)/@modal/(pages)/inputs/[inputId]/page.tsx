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

export const generateMetadata = async ({ params: { inputId } }: PageProps) => {
  const { data: input } = await getInput(inputId);
  return { title: formatTitle(['Inputs', input?.label]) };
};

const Page = async ({
  params: { inputId },
  searchParams: { back },
}: PageProps) => {
  if (!back) notFound();

  const [{ data: input }, { data: subjects }] = await Promise.all([
    getInput(inputId),
    listSubjectsByTeamId(),
  ]);

  if (!input || !subjects) notFound();

  return (
    <>
      <PageModalHeader back={back} title={input.label} />
      <InputForm back={back} input={input} subjects={subjects} />
    </>
  );
};

export default Page;
