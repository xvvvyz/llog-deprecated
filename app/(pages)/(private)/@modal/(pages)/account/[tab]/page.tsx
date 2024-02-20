import AccountEmailForm from '@/_components/account-email-form';
import AccountPasswordForm from '@/_components/account-password-form';
import AccountProfileForm from '@/_components/account-profile-form';
import Button from '@/_components/button';
import PageModalHeader from '@/_components/page-modal-header';
import getCurrentUserFromSession from '@/_queries/get-current-user-from-session';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    tab: string;
  };
  searchParams: {
    back?: string;
  };
}

export const generateMetadata = ({ params: { tab } }: PageProps) => {
  return { title: `Account ${tab}` };
};

const Page = async ({ params: { tab }, searchParams: { back } }: PageProps) => {
  if (!back) notFound();
  const user = await getCurrentUserFromSession();
  if (!user || !['email', 'password', 'profile'].includes(tab)) notFound();

  return (
    <>
      <PageModalHeader back={back} title="Account settings" />
      <div className="!border-t-0 px-4 pb-8 sm:px-8">
        <div className="grid w-full grid-cols-3 divide-x divide-alpha-3 rounded border border-alpha-3">
          <Button
            activeClassName="text-fg-2 bg-alpha-1"
            className="m-0 justify-center rounded-l py-1.5 hover:bg-alpha-1"
            href={`/account/profile?back=${back}`}
            replace
            scroll={false}
            variant="link"
          >
            Profile
          </Button>
          <Button
            activeClassName="text-fg-2 bg-alpha-1"
            className="m-0 justify-center py-1.5 hover:bg-alpha-1"
            href={`/account/email?back=${back}`}
            replace
            scroll={false}
            variant="link"
          >
            Email
          </Button>
          <Button
            activeClassName="text-fg-2 bg-alpha-1"
            className="m-0 justify-center rounded-r py-1.5 hover:bg-alpha-1"
            href={`/account/password?back=${back}`}
            replace
            scroll={false}
            variant="link"
          >
            Password
          </Button>
        </div>
      </div>
      {tab === 'profile' && <AccountProfileForm back={back} user={user} />}
      {tab === 'email' && <AccountEmailForm back={back} user={user} />}
      {tab === 'password' && <AccountPasswordForm back={back} />}
    </>
  );
};

export default Page;
