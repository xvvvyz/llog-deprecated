import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Header from '(components)/header';
import formatTitle from '(utilities)/format-title';
import listSubjectsByTeamId from '(utilities)/list-subjects-by-team-id';
import InputForm from '../../(components)/input-form';

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
export const revalidate = 0;
export default Page;
