'use client';

import Avatar from '@/(account)/_components/avatar';
import DateTime from '@/(account)/_components/date-time';
import DirtyHtml from '@/(account)/_components/dirty-html';
import Empty from '@/(account)/_components/empty';
import IconButton from '@/(account)/_components/icon-button';
import NotificationTypes from '@/(account)/_constants/enum-notification-types';
import { ListNotificationsData } from '@/(account)/_server/list-notifications';
import firstIfArray from '@/(account)/_utilities/first-if-array';
import ViewEventButton from '@/(account)/notifications/_components/view-event-button';
import Button from '@/_components/button';
import { experimental_useOptimistic as useOptimistic } from 'react';

import {
  BoltIcon,
  ChatBubbleBottomCenterTextIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  StarIcon,
  UserPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface NotificationsProps {
  deleteNotificationAction: (id: string) => Promise<void>;
  eventOrSessionIdNotificationIdMap: Record<string, string[]>;
  notifications: NonNullable<ListNotificationsData>;
  toggleNotificationReadAction: ({
    id,
    read,
  }: {
    id: string;
    read: boolean;
  }) => Promise<void>;
}

const Notifications = ({
  deleteNotificationAction,
  eventOrSessionIdNotificationIdMap,
  notifications,
  toggleNotificationReadAction,
}: NotificationsProps) => {
  const [optimisticNotifications, optimisticAction] = useOptimistic(
    notifications,
    (state, { action, id }) => {
      switch (action) {
        case 'delete': {
          return state.filter((n) => n.id !== id);
        }

        case 'toggle-read': {
          return state.map((n) => (n.id === id ? { ...n, read: !n.read } : n));
        }

        default: {
          return state;
        }
      }
    }
  );

  if (!optimisticNotifications.length) return <Empty>No notifications</Empty>;

  return optimisticNotifications.map((n) => {
    const comment = firstIfArray(n.comment);
    const profile = firstIfArray(n.profile);
    const sourceEvent = comment?.event ?? n.event;
    const subject = firstIfArray(n.subject);

    return (
      <div
        className="flex items-start gap-9 rounded border border-alpha-1 bg-bg-2 p-4"
        key={n.id}
      >
        <div className="relative">
          <Button
            className="m-0 block p-0"
            href={`/subjects/${subject.id}/timeline?back=/notifications`}
            variant="link"
          >
            <Avatar file={subject.image_uri} name={subject.name} />
          </Button>
          <div className="absolute -bottom-4 -right-4 rounded-full bg-bg-2">
            <div className="rounded-full border border-alpha-1 bg-alpha-1 p-1">
              {n.type === NotificationTypes.Comment && (
                <ChatBubbleBottomCenterTextIcon className="w-5" />
              )}
              {n.type === NotificationTypes.Event &&
                (sourceEvent.type.session ? (
                  <StarIcon className="w-5" />
                ) : (
                  <BoltIcon className="w-5" />
                ))}
              {n.type === NotificationTypes.JoinSubject && (
                <UserPlusIcon className="w-5" />
              )}
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="-mt-1 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-4">
              {!n.read && (
                <div className="mt-0.5 h-3 w-3 rounded-full border border-alpha-4 bg-red-1" />
              )}
              <DateTime
                className="smallcaps whitespace-nowrap"
                date={n.created_at}
                formatter="relative"
              />
            </div>
            <div className="ml-auto flex gap-6">
              <form
                action={async () => {
                  optimisticAction({ action: 'toggle-read', id: n.id });
                  await toggleNotificationReadAction(n);
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
                  optimisticAction({ action: 'delete', id: n.id });
                  await deleteNotificationAction(n.id);
                }}
              >
                <IconButton
                  icon={<XMarkIcon className="w-5" />}
                  type="submit"
                  variant="link"
                />
              </form>
            </div>
          </div>
          <ViewEventButton
            href={
              sourceEvent
                ? sourceEvent.type.session
                  ? `/subjects/${subject.id}/missions/${sourceEvent.type.session.mission.id}/sessions/${sourceEvent.type.session.id}?back=/notifications`
                  : `/subjects/${subject.id}/events/${sourceEvent.id}?back=/notifications`
                : `/subjects/${subject.id}/timeline?back=/notifications`
            }
            notificationIds={
              eventOrSessionIdNotificationIdMap[
                sourceEvent?.type?.session?.id ?? sourceEvent?.id ?? subject.id
              ]
            }
            notificationRead={n.read}
          >
            {profile.first_name} {profile.last_name}{' '}
            {n.type === NotificationTypes.JoinSubject ? (
              <>joined {subject.name}</>
            ) : (
              <>
                {n.type === NotificationTypes.Comment && 'commented on'}
                {n.type === NotificationTypes.Event &&
                  (sourceEvent.type.session ? 'completed a' : 'recorded')}{' '}
                {sourceEvent.type.session?.mission?.name ??
                  sourceEvent.type.name}
                {sourceEvent.type.session && (
                  <>
                    {' '}
                    session&nbsp;{sourceEvent.type.session.order + 1}
                    &nbsp;
                    {n.type === NotificationTypes.Comment ? (
                      <>module&nbsp;{sourceEvent.type.order + 1}</>
                    ) : (
                      'module'
                    )}
                  </>
                )}
              </>
            )}
          </ViewEventButton>
          {comment && <DirtyHtml className="pt-4">{comment.content}</DirtyHtml>}
        </div>
      </div>
    );
  });
};

export default Notifications;
