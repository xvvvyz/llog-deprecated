import InputForm from '@/_components/input-form';
import PageModal from '@/_components/page-modal';
import PageModalHeader from '@/_components/page-modal-header';
import getInput from '@/_queries/get-input';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import formatTitle from '@/_utilities/format-title';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    inputId: string;
  };
}

export const generateMetadata = async ({ params: { inputId } }: PageProps) => {
  const { data: input } = await getInput(inputId);
  return { title: formatTitle(['Inputs', input?.label]) };
};

const Page = async ({ params: { inputId } }: PageProps) => {
  const [{ data: input }, { data: subjects }] = await Promise.all([
    getInput(inputId),
    listSubjectsByTeamId(),
  ]);

  if (!input || !subjects) notFound();
  const back = '/inputs';

  return (
    <PageModal back={back} temporary_forcePath={`/inputs/${inputId}`}>
      <PageModalHeader back={back} title={input.label} />
      <InputForm back={back} input={input} subjects={subjects} />
    </PageModal>
  );
};

export default Page;
