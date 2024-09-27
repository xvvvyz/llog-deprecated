import AccountProfileForm from '@/_components/account-profile-form';
import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import getCurrentUser from '@/_queries/get-current-user';

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <Modal.Content>
      <PageModalHeader title="Edit profile" />
      <AccountProfileForm user={user} />
    </Modal.Content>
  );
};

export default Page;
