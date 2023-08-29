import InputForm from '@/(account)/inputs/_components/input-form';
import BackButton from '@/_components/back-button';
import Breadcrumbs from '@/_components/breadcrumbs';
import Header from '@/_components/header';
import listSubjectsByTeamId from '@/_server/list-subjects-by-team-id';
import formatTitle from '@/_utilities/format-title';

export const metadata = {
  title: formatTitle(['Inputs', 'Create']),
};

export const revalidate = 0;

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

export default Page;
