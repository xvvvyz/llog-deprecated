import AccountPasswordForm from '@/_components/account-password-form';
import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';

const Page = () => (
  <Modal.Content>
    <PageModalHeader title="Change password" />
    <AccountPasswordForm />
  </Modal.Content>
);

export default Page;
