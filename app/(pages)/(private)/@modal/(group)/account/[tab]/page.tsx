import AccountEmailForm from '@/_components/account-email-form';
import AccountPasswordForm from '@/_components/account-password-form';
import AccountProfileForm from '@/_components/account-profile-form';
import getCurrentUserFromSession from '@/_queries/get-current-user-from-session';

interface PageProps {
  params: {
    tab: string;
  };
}

export const generateMetadata = ({ params: { tab } }: PageProps) => {
  return { title: `Account ${tab}` };
};

const Page = async ({ params: { tab } }: PageProps) => {
  const user = await getCurrentUserFromSession();
  if (!user || !['email', 'password', 'profile'].includes(tab)) return null;

  switch (tab) {
    case 'profile': {
      return <AccountProfileForm user={user} />;
    }

    case 'email': {
      return <AccountEmailForm user={user} />;
    }

    case 'password': {
      return <AccountPasswordForm />;
    }
  }
};

export default Page;
