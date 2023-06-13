import BackButton from '@/(account)/_components/back-button';
import Breadcrumbs from '@/(account)/_components/breadcrumbs';
import Header from '@/(account)/_components/header';
import listSubjectsByTeamId from '@/(account)/_server/list-subjects-by-team-id';
import formatTitle from '@/(account)/_utilities/format-title';
import InputForm from '@/(account)/inputs/_components/input-form';

const Page = async () => {
  const { data: subjects } = await listSubjectsByTeamId();

  return (
    <>
      <Header>
        <BackButton href="/inputs" />
        <Breadcrumbs items={[['Inputs', '/inputs'], ['Create']]} />
      </Header>
      <InputForm subjects={subjects} />
    </>
  );
};

export const metadata = { title: formatTitle(['Inputs', 'Create']) };
export default Page;
