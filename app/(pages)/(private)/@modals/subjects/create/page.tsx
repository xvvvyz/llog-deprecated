import PageModal from '@/_components/page-modal';
import PageModalHeader from '@/_components/page-modal-header';
import SubjectForm from '@/_components/subject-form';
import formatTitle from '@/_utilities/format-title';

export const metadata = { title: formatTitle(['Subjects', 'Create']) };
const back = '/subjects';

const Page = () => (
  <PageModal back={back} temporary_forcePath="/subjects/create">
    <PageModalHeader back={back} title="Create subject" />
    <SubjectForm back={back} />
  </PageModal>
);

export default Page;
