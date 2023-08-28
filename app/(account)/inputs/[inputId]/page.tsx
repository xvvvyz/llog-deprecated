import BackButton from '@/(account)/_components/back-button';
import Breadcrumbs from '@/(account)/_components/breadcrumbs';
import Header from '@/(account)/_components/header';
import getInput, { GetInputData } from '@/(account)/_server/get-input';
import listSubjectsByTeamId from '@/(account)/_server/list-subjects-by-team-id';
import formatTitle from '@/(account)/_utilities/format-title';
import InputForm from '@/(account)/inputs/_components/input-form';
import { notFound } from 'next/navigation';

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

  if (!input) notFound();

  return (
    <>
      <Header>
        <BackButton href="/inputs" />
        <Breadcrumbs items={[['Inputs', '/inputs'], [input.label]]} />
      </Header>
      <InputForm input={input as GetInputData} subjects={subjects} />
    </>
  );
};

export default Page;
