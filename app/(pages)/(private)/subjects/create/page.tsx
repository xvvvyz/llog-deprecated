import BackButton from '@/_components/back-button';
import Breadcrumbs from '@/_components/breadcrumbs';
import SubjectForm from '@/_components/subject-form';
import formatTitle from '@/_utilities/format-title';

export const metadata = { title: formatTitle(['Subjects', 'Create']) };

const Page = () => (
  <>
    <div className="my-16 flex h-8 items-center justify-between gap-8 px-4">
      <BackButton href="/subjects" />
      <Breadcrumbs items={[['Subjects', '/subjects'], ['Create']]} />
    </div>
    <SubjectForm />
  </>
);

export default Page;
