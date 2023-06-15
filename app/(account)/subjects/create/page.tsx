import BackButton from '@/(account)/_components/back-button';
import Breadcrumbs from '@/(account)/_components/breadcrumbs';
import Header from '@/(account)/_components/header';
import formatTitle from '@/(account)/_utilities/format-title';
import SubjectForm from '@/(account)/subjects/_components/subject-form';

export const metadata = {
  title: formatTitle(['Subjects', 'Create']),
};

const Page = async () => (
  <>
    <Header>
      <BackButton href="/subjects" />
      <Breadcrumbs items={[['Subjects', '/subjects'], ['Create']]} />
    </Header>
    <SubjectForm />
  </>
);

export default Page;
