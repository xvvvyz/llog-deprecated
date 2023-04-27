import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Header from '(components)/header';
import formatTitle from '(utilities)/format-title';
import listSubjectsByTeamId from '(utilities)/list-subjects-by-team-id';
import { notFound } from 'next/navigation';
import InputForm from '../../../../(components)/input-form';

import getInputWithoutIds, {
  GetInputWithoutIdsData,
} from '(utilities)/get-input-without-ids';

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
    <>
      <Header>
        <BackButton href="/inputs" />
        <Breadcrumbs items={[['Inputs', '/inputs'], ['Add']]} />
      </Header>
      <InputForm
        duplicateInputData={input as GetInputWithoutIdsData}
        subjects={subjects}
      />
    </>
  );
};

export const metadata = { title: formatTitle(['Inputs', 'Add']) };
export const revalidate = 0;
export default Page;
