import Header from '@/(account)/_components/header';
import listNotifications from '@/(account)/_server/list-notifications';
import forceArray from '@/(account)/_utilities/force-array';
import Notifications from '@/(account)/notifications/_components/notifications';
import createServerActionClient from '@/_server/create-server-action-client';
import { revalidatePath } from 'next/cache';

export const metadata = {
  title: 'Notifications',
};

export const revalidate = 0;

const Page = async () => {
  const { data } = await listNotifications();
  const notifications = forceArray(data);

  const eventOrSessionIdNotificationIdMap = notifications.reduce((acc, n) => {
    const event = n.comment?.event ?? n.event;

    const subjectOrEventOrSessionId =
      event?.type?.session?.id ?? event?.id ?? n.subject.id;

    if (!acc[subjectOrEventOrSessionId]) acc[subjectOrEventOrSessionId] = [];
    acc[subjectOrEventOrSessionId].push(n.id);
    return acc;
  }, {});

  return (
    <>
      <Header>
        <h1 className="text-2xl">Notifications</h1>
      </Header>
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
    </>
  );
};

export default Page;
