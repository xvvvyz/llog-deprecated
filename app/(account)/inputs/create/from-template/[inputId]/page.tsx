import BackButton from '@/(account)/_components/back-button';
import Breadcrumbs from '@/(account)/_components/breadcrumbs';
import Header from '@/(account)/_components/header';
import listSubjectsByTeamId from '@/(account)/_server/list-subjects-by-team-id';
import formatTitle from '@/(account)/_utilities/format-title';
import InputForm from '@/(account)/inputs/_components/input-form';
import { notFound } from 'next/navigation';

import getInputWithoutIds, {
  GetInputWithoutIdsData,
} from '@/(account)/_server/get-input-without-ids';

interface PageProps {
  params: {
    inputId: string;
  };
}

const Page = async ({ params: { inputId } }: PageProps) => {
  const [{ data: subjects }, { data: input }] = await Promise.all([
    listSubjectsByTeamId(),
    getInputWithoutIds(inputId),
  ]);

  if (!input) notFound();

  return (
    <div className="px-4">
      <Header>
        <BackButton href="/inputs" />
        <Breadcrumbs items={[['Inputs', '/inputs'], ['Create']]} />
      </Header>
      <InputForm
        duplicateInputData={input as GetInputWithoutIdsData}
        subjects={subjects}
      />
    </div>
  );
};

export const metadata = { title: formatTitle(['Inputs', 'Create']) };
export const revalidate = 0;
export default Page;
