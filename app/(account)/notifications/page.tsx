import Avatar from '@/(account)/_components/avatar';
import DateTime from '@/(account)/_components/date-time';
import DirtyHtml from '@/(account)/_components/dirty-html';
import Empty from '@/(account)/_components/empty';
import Header from '@/(account)/_components/header';
import IconButton from '@/(account)/_components/icon-button';
import NotificationTypes from '@/(account)/_constants/enum-notification-types';
import listNotifications from '@/(account)/_server/list-notifications';
import forceArray from '@/(account)/_utilities/force-array';
import Button from '@/_components/button';
import createServerActionClient from '@/_server/create-server-action-client';
import ViewEventButton from './_components/view-event-button';

import {
  ChatBubbleBottomCenterTextIcon,
  CheckBadgeIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  TrashIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';

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
        {notifications.length ? (
          notifications.map((n) => {
            const sourceEvent = n.comment?.event ?? n.event;

            return (
              <div
                className="flex items-start gap-9 rounded border border-alpha-1 bg-bg-2 p-4"
                key={n.id}
              >
                <div className="relative">
                  <Button
                    className="m-0 block p-0"
                    href={`/subjects/${n.subject.id}/timeline?back=/notifications`}
                    variant="link"
                  >
                    <Avatar file={n.subject.image_uri} name={n.subject.name} />
                  </Button>
                  <div className="absolute -bottom-4 -right-4 rounded-full bg-bg-2">
                    <div className="rounded-full border border-alpha-1 bg-alpha-1 p-1">
                      {n.type === NotificationTypes.Comment && (
                        <ChatBubbleBottomCenterTextIcon className="w-5" />
                      )}
                      {n.type === NotificationTypes.Event && (
                        <CheckBadgeIcon className="w-5" />
                      )}
                      {n.type === NotificationTypes.JoinSubject && (
                        <UserPlusIcon className="w-5" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="-my-1 w-full leading-snug">
                  <ViewEventButton
                    href={
                      sourceEvent
                        ? sourceEvent.type.session
                          ? `/subjects/${n.subject.id}/mission/${sourceEvent.type.session.mission.id}/session/${sourceEvent.type.session.id}?back=/notifications`
                          : `/subjects/${n.subject.id}/event/${sourceEvent.id}?back=/notifications`
                        : `/subjects/${n.subject.id}/timeline?back=/notifications`
                    }
                    notificationIds={
                      eventOrSessionIdNotificationIdMap[
                        sourceEvent?.type?.session?.id ??
                          sourceEvent?.id ??
                          n.subject.id
                      ]
                    }
                    notificationRead={n.read}
                  >
                    {n.profile?.first_name} {n.profile?.last_name}{' '}
                    {n.type === NotificationTypes.JoinSubject ? (
                      <>joined {n.subject.name}</>
                    ) : (
                      <>
                        {n.type === NotificationTypes.Comment && 'commented on'}
                        {n.type === NotificationTypes.Event &&
                          (sourceEvent.type.session
                            ? 'completed a routine on'
                            : 'recorded')}{' '}
                        {sourceEvent.type.session?.mission?.name ??
                          sourceEvent.type.name}
                        {sourceEvent.type.session && (
                          <>
                            {' '}
                            session&nbsp;{sourceEvent.type.session.order + 1}
                          </>
                        )}
                      </>
                    )}
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
export default Page;
