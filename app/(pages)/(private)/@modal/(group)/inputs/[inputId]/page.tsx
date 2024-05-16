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

export const metadata = { title: formatTitle(['Inputs', 'Edit']) };

const Page = async ({ params: { inputId } }: PageProps) => {
  const [{ data: input }, { data: subjects }] = await Promise.all([
    getInput(inputId),
    listSubjectsByTeamId(),
  ]);

  if (!input || !subjects) return null;

  return (
    <>
      <PageModalHeader title={input.label} />
      <InputForm input={input} subjects={subjects} />
    </>
  );
};

export default Page;
