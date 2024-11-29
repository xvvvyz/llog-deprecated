import Notifications from '@/_components/notifications';
import PageBreadcrumb from '@/_components/page-breadcrumb';
import listNotifications from '@/_queries/list-notifications';

const Page = async () => {
  const [{ data: notifications }] = await Promise.all([listNotifications()]);
  if (!notifications) return null;

  return (
    <>
      <PageBreadcrumb last="Inbox" />
      <Notifications notifications={notifications} />
    </>
  );
};

export default Page;
