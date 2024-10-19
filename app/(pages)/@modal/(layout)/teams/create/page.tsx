import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import TeamForm from '@/_components/team-form';

const Page = async () => (
  <Modal.Content>
    <PageModalHeader title="New organization" />
    <TeamForm />
  </Modal.Content>
);

export default Page;
