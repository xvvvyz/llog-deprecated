import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Header from '(components)/header';
import formatTitle from '(utilities)/format-title';
import AddSubjectForm from './(components)/add-subject-form';

const Page = async () => (
  <>
    <Header>
      <BackButton href="/subjects" />
      <Breadcrumbs items={[['Subjects', '/subjects'], ['Add']]} />
    </Header>
    <AddSubjectForm />
  </>
);

export const metadata = { title: formatTitle(['Subjects', 'Add']) };
export default Page;
