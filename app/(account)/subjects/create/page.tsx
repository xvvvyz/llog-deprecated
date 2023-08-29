import SubjectForm from '@/(account)/subjects/_components/subject-form';
import BackButton from '@/_components/back-button';
import Breadcrumbs from '@/_components/breadcrumbs';
import Header from '@/_components/header';
import formatTitle from '@/_utilities/format-title';

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
