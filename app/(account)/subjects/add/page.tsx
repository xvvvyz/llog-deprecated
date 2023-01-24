import BackButton from 'components/back-button';
import Breadcrumbs from 'components/breadcrumbs';
import Card from 'components/card';
import Header from 'components/header';
import listInputs from 'utilities/list-inputs';
import listTemplates from 'utilities/list-templates';
import SubjectForm from '../components/subject-form';

const Page = async () => {
  const [{ data: availableInputs }, { data: availableTemplates }] =
    await Promise.all([listInputs(), listTemplates()]);

  return (
    <>
      <Header>
        <BackButton href="/subjects" />
        <Breadcrumbs items={[['Subjects', '/subjects'], ['Add']]} />
      </Header>
      <Card as="main" breakpoint="sm">
        <SubjectForm
          availableInputs={availableInputs}
          availableTemplates={availableTemplates}
        />
      </Card>
    </>
  );
};

export const dynamic = 'force-dynamic';
export default Page;
