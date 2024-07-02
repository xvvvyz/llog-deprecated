import AccountEmailForm from '@/_components/account-email-form';
import AccountPasswordForm from '@/_components/account-password-form';
import AccountProfileForm from '@/_components/account-profile-form';
import getCurrentUser from '@/_queries/get-current-user';

interface PageProps {
  params: {
    tab: string;
  };
}

export const metadata = { title: 'Account' };

const Page = async ({ params: { tab } }: PageProps) => {
  const user = await getCurrentUser();
  if (!user || !['email', 'password', 'profile'].includes(tab)) return null;

  return (
    <>
      {tab === 'profile' && <AccountProfileForm user={user} />}
      {tab === 'email' && <AccountEmailForm user={user} />}
      {tab === 'password' && <AccountPasswordForm />}
    </>
  );
};

export default Page;
