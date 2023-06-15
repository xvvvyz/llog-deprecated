import BackButton from '@/(account)/_components/back-button';
import Breadcrumbs from '@/(account)/_components/breadcrumbs';
import Header from '@/(account)/_components/header';
import getInput, { GetInputData } from '@/(account)/_server/get-input';
import listSubjectsByTeamId from '@/(account)/_server/list-subjects-by-team-id';
import formatTitle from '@/(account)/_utilities/format-title';
import InputForm from '@/(account)/inputs/_components/input-form';
import { notFound } from 'next/navigation';

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

  if (!input) notFound();

  return (
    <div className="px-4">
      <Header>
        <BackButton href="/inputs" />
        <Breadcrumbs items={[['Inputs', '/inputs'], ['Create']]} />
      </Header>
      <InputForm
        duplicateInputData={input as GetInputData}
        subjects={subjects}
      />
    </div>
  );
};

export default Page;
