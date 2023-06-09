import Avatar from '@/_components/avatar';
import DateTime from '@/_components/date-time';
import DirtyHtml from '@/_components/dirty-html';
import Empty from '@/_components/empty';
import Header from '@/_components/header';
import IconButton from '@/_components/icon-button';
import NotificationTypes from '@/_constants/enum-notification-types';
import createServerActionClient from '@/_server/create-server-action-client';
import listNotifications from '@/_server/list-notifications';
import forceArray from '@/_utilities/force-array';
import { revalidatePath } from 'next/cache';
import ViewEventButton from './_components/view-event-button';

import {
  ChatBubbleBottomCenterTextIcon,
  CheckBadgeIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const Page = async () => {
  const { data } = await listNotifications();
  const notifications = forceArray(data);

  const eventOrSessionIdNotificationIdMap = notifications.reduce((acc, n) => {
    const event = n.comment?.event ?? n.event;
    const eventOrSessionId = event.type.session?.id ?? event.id;
    if (!acc[eventOrSessionId]) acc[eventOrSessionId] = [];
    acc[eventOrSessionId].push(n.id);
    return acc;
  }, {});

  return (
    <>
      <Header>
        <h1 className="text-2xl">Notifications</h1>
      </Header>
      <div className="space-y-4 px-4">
        {notifications.length ? (
          notifications.map((n) => {
            const profile = n.comment?.profile ?? n.event?.profile;
            const event = n.comment?.event ?? n.event;

            return (
              <div
                className="flex items-start gap-9 rounded border border-alpha-1 bg-bg-2 p-4"
                key={n.id}
              >
                <div className="relative">
                  <Avatar
                    file={event.subject.image_uri}
                    name={event.subject.name}
                  />
                  <div className="absolute -bottom-4 -right-4 rounded-full bg-bg-2">
                    <div className="rounded-full border border-alpha-1 bg-alpha-1 p-1">
                      {n.type === NotificationTypes.Comment && (
                        <ChatBubbleBottomCenterTextIcon className="w-5" />
                      )}
                      {n.type === NotificationTypes.Event && (
                        <CheckBadgeIcon className="w-5" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="-my-1 w-full leading-snug">
                  <ViewEventButton
                    href={
                      event.type.session
                        ? `/subjects/${event.subject.id}/mission/${event.type.session.mission.id}/session/${event.type.session.id}?back=/notifications`
                        : `/subjects/${event.subject.id}/event/${event.id}?back=/notifications`
                    }
                    notificationIds={
                      eventOrSessionIdNotificationIdMap[
                        event.type.session?.id ?? event.id
                      ]
                    }
                    notificationRead={n.read}
                  >
                    {profile.first_name} {profile.last_name}{' '}
                    {n.type === NotificationTypes.Comment && 'commented on'}
                    {n.type === NotificationTypes.Event &&
                      (event.type.session
                        ? 'recorded a routine on'
                        : 'recorded')}{' '}
                    {event.type.session?.mission?.name ?? event.type.name}
                  </ViewEventButton>
                  {n.comment && (
                    <DirtyHtml className="line-clamp-2 pt-3">
                      {n.comment.content}
                    </DirtyHtml>
                  )}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
                    <div className="flex gap-4">
                      {!n.read && (
                        <div className="relative top-[0.075em] h-3 w-3 rounded-full border border-alpha-4 bg-red-1" />
                      )}
                      <DateTime
                        className="whitespace-nowrap text-xs uppercase tracking-widest text-fg-3"
                        date={n.created_at}
                        formatter="relative"
                      />
                    </div>
                    <div className="ml-auto flex gap-6">
                      <form
                        action={async () => {
                          'use server';

                          await createServerActionClient()
                            .from('notifications')
                            .update({ read: !n.read })
                            .eq('id', n.id);

                          revalidatePath('/notifications');
                        }}
                      >
                        <IconButton
                          icon={
                            n.read ? (
                              <EnvelopeIcon className="w-5" />
                            ) : (
                              <EnvelopeOpenIcon className="w-5" />
                            )
                          }
                          type="submit"
                          variant="link"
                        />
                      </form>
                      <form
                        action={async () => {
                          'use server';

                          await createServerActionClient()
                            .from('notifications')
                            .delete()
                            .eq('id', n.id);

                          revalidatePath('/notifications');
                        }}
                      >
                        <IconButton
                          icon={<TrashIcon className="w-5" />}
                          type="submit"
                          variant="link"
                        />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <Empty>No notifications</Empty>
        )}
      </div>
    </>
  );
};

export const metadata = { title: 'Notifications' };
export const revalidate = 0;
export default Page;
