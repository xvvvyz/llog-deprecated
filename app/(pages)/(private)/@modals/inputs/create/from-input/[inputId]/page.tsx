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

export const metadata = { title: formatTitle(['Inputs', 'Create']) };

const Page = async ({ params: { inputId } }: PageProps) => {
  const [{ data: subjects }, { data: input }] = await Promise.all([
    listSubjectsByTeamId(),
    getInput(inputId),
  ]);

  if (!input || !subjects) notFound();
  const back = '/inputs';

  return (
    <PageModal
      back={back}
      temporary_forcePath={`/inputs/create/from-input/${inputId}`}
    >
      <PageModalHeader back={back} title="Create input" />
      <InputForm back={back} input={input} isDuplicate subjects={subjects} />
    </PageModal>
  );
};

export default Page;
