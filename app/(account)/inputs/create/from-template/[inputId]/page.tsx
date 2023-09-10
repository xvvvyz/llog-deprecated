import InputForm from '@/(account)/inputs/_components/input-form';
import BackButton from '@/_components/back-button';
import Breadcrumbs from '@/_components/breadcrumbs';
import getInput, { GetInputData } from '@/_server/get-input';
import listSubjectsByTeamId from '@/_server/list-subjects-by-team-id';
import formatTitle from '@/_utilities/format-title';

export const metadata = {
  title: formatTitle(['Inputs', 'Create']),
};

export const revalidate = 0;

interface PageProps {
  params: {
    inputId: string;
  };
}

const Page = async ({ params: { inputId } }: PageProps) => {
  const [{ data: subjects }, { data: input }] = await Promise.all([
    listSubjectsByTeamId(),
    getInput(inputId),
  ]);

  if (!input) return null;

  return (
    <>
      <div className="my-16 flex h-8 items-center justify-between gap-8 px-4">
        <BackButton href="/inputs" />
        <Breadcrumbs items={[['Inputs', '/inputs'], ['Create']]} />
      </div>
      <InputForm
        duplicateInputData={input as GetInputData}
        subjects={subjects}
      />
    </>
  );
};

export default Page;
