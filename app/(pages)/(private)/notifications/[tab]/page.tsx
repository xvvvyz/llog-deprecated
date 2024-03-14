import Notifications from '@/_components/notifications';
import listNotifications from '@/_queries/list-notifications';

interface PageProps {
  params: {
    tab: string;
  };
}

export const generateMetadata = ({ params: { tab } }: PageProps) => {
  return { title: `Notifications ${tab}` };
};

const Page = async ({ params: { tab } }: PageProps) => {
  if (!['archive', 'inbox'].includes(tab)) return null;

  const { data: notifications } = await listNotifications({
    archived: tab === 'archive',
  });

  return <Notifications notifications={notifications} />;
};

export default Page;
