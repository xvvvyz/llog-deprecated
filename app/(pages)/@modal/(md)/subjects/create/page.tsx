import PageModalHeader from '@/_components/page-modal-header';
import SubjectForm from '@/_components/subject-form';
import formatTitle from '@/_utilities/format-title';

export const metadata = { title: formatTitle(['Subjects', 'New']) };

const Page = () => (
  <>
    <PageModalHeader title="New subject" />
    <SubjectForm />
  </>
);

export default Page;
