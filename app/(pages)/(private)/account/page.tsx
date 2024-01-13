import AccountForm from '@/_components/account-form';
import getCurrentUser from '@/_server/get-current-user';
import formatTitle from '@/_utilities/format-title';
import { User } from '@supabase/supabase-js';

export const metadata = { title: formatTitle('Account') };
export const revalidate = 0;

const Page = async () => (
  <AccountForm user={(await getCurrentUser()) as User} />
);

export default Page;
