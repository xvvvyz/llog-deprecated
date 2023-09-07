import Notifications from '@/(account)/notifications/_components/notifications';
import Empty from '@/_components/empty';
import createServerActionClient from '@/_server/create-server-action-client';
import listNotifications from '@/_server/list-notifications';
import forceArray from '@/_utilities/force-array';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { revalidatePath } from 'next/cache';

export const metadata = {
  title: 'Notifications',
};

export const revalidate = 0;

const Page = async () => {
  const { data } = await listNotifications();
  const notifications = forceArray(data);

  if (!notifications.length) {
    return (
      <Empty className="mx-4">
        <InformationCircleIcon className="w-7" />
        Events and comments added by
        <br />
        others will appear here.
      </Empty>
    );
  }

  const eventOrSessionIdNotificationIdMap = notifications.reduce((acc, n) => {
    const event = n.comment?.event ?? n.event;

    const subjectOrEventOrSessionId =
      event?.type?.session?.id ?? event?.id ?? n.subject.id;

    if (!acc[subjectOrEventOrSessionId]) acc[subjectOrEventOrSessionId] = [];
    acc[subjectOrEventOrSessionId].push(n.id);
    return acc;
  }, {});

  return (
    <div className="space-y-4 px-4">
      <Notifications
        deleteNotificationAction={async (id) => {
          'use server';

          await createServerActionClient()
            .from('notifications')
            .delete()
            .eq('id', id);

          revalidatePath('/notifications');
        }}
        eventOrSessionIdNotificationIdMap={eventOrSessionIdNotificationIdMap}
        notifications={notifications}
        toggleNotificationReadAction={async ({ id, read }) => {
          'use server';

          await createServerActionClient()
            .from('notifications')
            .update({ read: !read })
            .eq('id', id);

          revalidatePath('/notifications');
        }}
      />
    </div>
  );
};

export default Page;
