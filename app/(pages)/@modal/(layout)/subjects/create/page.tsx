import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import SubjectForm from '@/_components/subject-form';

const Page = () => (
  <Modal.Content>
    <PageModalHeader title="New subject" />
    <SubjectForm />
  </Modal.Content>
);

export default Page;
