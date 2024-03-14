import Notifications from '@/_components/notifications';
import listNotifications from '@/_queries/list-notifications';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    tab: string;
  };
}

export const generateMetadata = ({ params: { tab } }: PageProps) => {
  return { title: `Notifications ${tab}` };
};

const Page = async ({ params: { tab } }: PageProps) => {
  if (!['archive', 'inbox'].includes(tab)) notFound();

  const { data: notifications } = await listNotifications({
    archived: tab === 'archive',
  });

  return <Notifications notifications={notifications} />;
};

export default Page;
