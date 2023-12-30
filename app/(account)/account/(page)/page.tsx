import AccountForm from '@/(account)/account/_components/account-form';
import getCurrentUser from '@/_server/get-current-user';
import formatTitle from '@/_utilities/format-title';

export const metadata = {
  title: formatTitle('Account'),
};

export const revalidate = 0;

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  return <AccountForm user={user} />;
};

export default Page;
