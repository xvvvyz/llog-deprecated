import CreateSubjectForm from '@/(account)/subjects/create/_components/create-subject-form';
import BackButton from '@/_components/back-button';
import Breadcrumbs from '@/_components/breadcrumbs';
import Header from '@/_components/header';
import formatTitle from '@/_utilities/format-title';

const Page = async () => (
  <>
    <Header>
      <BackButton href="/subjects" />
      <Breadcrumbs items={[['Subjects', '/subjects'], ['Create']]} />
    </Header>
    <CreateSubjectForm />
  </>
);

export const metadata = { title: formatTitle(['Subjects', 'Create']) };
export default Page;
