import PageModalHeader from '@/_components/page-modal-header';
import SubjectForm from '@/_components/subject-form';
import formatTitle from '@/_utilities/format-title';

export const metadata = { title: formatTitle(['Subjects', 'Create']) };

const Page = () => (
  <>
    <PageModalHeader title="Create subject" />
    <SubjectForm />
  </>
);

export default Page;
