import BackButton from '@/_components/back-button';
import Button from '@/_components/button';
import Notifications from '@/_components/notifications';
import PageModalHeader from '@/_components/page-modal-header';
import listNotifications from '@/_queries/list-notifications';
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
  return { title: `Notifications ${tab}` };
};

const Page = async ({ params: { tab }, searchParams: { back } }: PageProps) => {
  if (!back || !['archive', 'inbox'].includes(tab)) notFound();

  const { data: notifications } = await listNotifications({
    archived: tab === 'archive',
  });

  return (
    <>
      <PageModalHeader title="Notifications" />
      <div className="!border-t-0 px-4 pb-8 sm:px-8">
        <div className="grid w-full grid-cols-2 divide-x divide-alpha-3 rounded border border-alpha-3">
          <Button
            activeClassName="text-fg-2 bg-alpha-1"
            className="m-0 justify-center rounded-l py-1.5 hover:bg-alpha-1"
            forwardBackLink
            href="/notifications/inbox"
            replace
            scroll={false}
            variant="link"
          >
            Inbox
          </Button>
          <Button
            activeClassName="text-fg-2 bg-alpha-1"
            className="m-0 justify-center rounded-r py-1.5 hover:bg-alpha-1"
            forwardBackLink
            href="/notifications/archive"
            replace
            scroll={false}
            variant="link"
          >
            Archive
          </Button>
        </div>
      </div>
      <Notifications notifications={notifications} />
      <BackButton className="m-0 block w-full py-6 text-center" variant="link">
        Close
      </BackButton>
    </>
  );
};

export default Page;
