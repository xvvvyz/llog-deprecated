import InputForm from '@/(account)/inputs/_components/input-form';
import BackButton from '@/_components/back-button';
import Breadcrumbs from '@/_components/breadcrumbs';
import getInput, { GetInputData } from '@/_server/get-input';
import listSubjectsByTeamId from '@/_server/list-subjects-by-team-id';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: {
    inputId: string;
  };
}

export const generateMetadata = async ({ params: { inputId } }: PageProps) => {
  const { data: input } = await getInput(inputId);

  return {
    title: formatTitle(['Inputs', input?.label]),
  };
};

export const revalidate = 0;

const Page = async ({ params: { inputId } }: PageProps) => {
  const [{ data: input }, { data: subjects }] = await Promise.all([
    getInput(inputId),
    listSubjectsByTeamId(),
  ]);

  if (!input) return null;

  return (
    <>
      <div className="my-16 flex h-8 items-center justify-between gap-8 px-4">
        <BackButton href="/inputs" />
        <Breadcrumbs items={[['Inputs', '/inputs'], [input.label]]} />
      </div>
      <InputForm input={input as GetInputData} subjects={subjects} />
    </>
  );
};

export default Page;
