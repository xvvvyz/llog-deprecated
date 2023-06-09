import BackButton from '@/(account)/_components/back-button';
import Breadcrumbs from '@/(account)/_components/breadcrumbs';
import Header from '@/(account)/_components/header';
import formatTitle from '@/(account)/_utilities/format-title';
import CreateSubjectForm from '@/(account)/subjects/create/_components/create-subject-form';

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
