import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Header from '(components)/header';
import formatTitle from '(utilities)/format-title';
import listSubjectsByTeamId from '(utilities)/list-subjects-by-team-id';
import InputForm from '../../(components)/input-form';

import getInputWithoutIds, {
  GetInputWithoutIdsData,
} from '(utilities)/get-input-without-ids';

interface PageProps {
  searchParams?: {
    inputId?: string;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const [{ data: subjects }, { data: input }] = await Promise.all([
    listSubjectsByTeamId(),
    searchParams?.inputId
      ? getInputWithoutIds(searchParams.inputId)
      : Promise.resolve({ data: null }),
  ]);

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
