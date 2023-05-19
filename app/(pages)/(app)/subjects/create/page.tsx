import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Header from '(components)/header';
import formatTitle from '(utilities)/format-title';
import CreateSubjectForm from './(components)/create-subject-form';

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
