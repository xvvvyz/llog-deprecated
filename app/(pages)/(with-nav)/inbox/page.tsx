import Notifications from '@/_components/notifications';
import listNotifications from '@/_queries/list-notifications';

const Page = async () => {
  const { data: notifications } = await listNotifications();
  return <Notifications notifications={notifications} />;
};

export default Page;
