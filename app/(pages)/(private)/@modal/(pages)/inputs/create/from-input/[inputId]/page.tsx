import InputForm from '@/_components/input-form';
import PageModalHeader from '@/_components/page-modal-header';
import getInput from '@/_queries/get-input';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import formatTitle from '@/_utilities/format-title';

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

  if (!input || !subjects) return null;

  return (
    <>
      <PageModalHeader title="Create input" />
      <InputForm input={input} isDuplicate subjects={subjects} />
    </>
  );
};

export default Page;
