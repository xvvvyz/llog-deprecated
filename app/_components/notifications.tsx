import deleteNotification from '@/_actions/delete-notification';
import updateNotification from '@/_actions/update-notification';
import Avatar from '@/_components/avatar';
import Button from '@/_components/button';
import DateTime from '@/_components/date-time';
import DirtyHtml from '@/_components/dirty-html';
import Empty from '@/_components/empty';
import IconButton from '@/_components/icon-button';
import NotificationTypes from '@/_constants/enum-notification-types';
import { ListNotificationsData } from '@/_queries/list-notifications';
import { Database } from '@/_types/database';
import ArchiveBoxArrowDownIcon from '@heroicons/react/24/outline/ArchiveBoxArrowDownIcon';
import ArchiveBoxXMarkIcon from '@heroicons/react/24/outline/ArchiveBoxXMarkIcon';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';

interface NotificationsProps {
  notifications: ListNotificationsData;
}

const Notifications = ({ notifications }: NotificationsProps) => {
  if (!notifications?.length) {
    return (
      <Empty>
        <InformationCircleIcon className="w-7" />
        No notifications.
      </Empty>
    );
  }

  return (
    <ul className="m-0 divide-y divide-alpha-1 rounded border border-alpha-1 bg-bg-2 py-1">
      {notifications.map((n) => {
        const sourceEvent = n.comment?.event ?? n.event;

        // hack avoid "SelectQueryError" due to the following query:
        // profile:source_profile_id(first_name, image_uri, last_name)
        const profile =
          n?.profile as unknown as Database['public']['Tables']['profiles']['Row'];

        return (
          <li className="relative" key={n.id}>
            <Button
              className="m-0 w-full items-start gap-6 px-4 py-7 text-fg-4 hover:bg-alpha-1 hover:text-fg-4 sm:px-8"
              href={
                sourceEvent
                  ? sourceEvent.type?.session
                    ? `/subjects/${n?.subject?.id}/training-plans/${sourceEvent.type.session.mission?.id}/sessions/${sourceEvent.type.session.id}`
                    : `/subjects/${n?.subject?.id}/events/${sourceEvent.id}`
                  : `/subjects/${n?.subject?.id}`
              }
              scroll={!sourceEvent}
              variant="link"
            >
              <Avatar
                className="mt-1"
                file={profile?.image_uri}
                id={profile?.id}
              />
              <div className="w-full space-y-4">
                <DateTime
                  className="smallcaps block"
                  date={n.created_at}
                  formatter="relative"
                />
                <p>
                  <span className="text-fg-2">
                    {profile?.first_name} {profile?.last_name}
                  </span>{' '}
                  {n.type === NotificationTypes.JoinSubject ? (
                    <>joined {n?.subject?.name}</>
                  ) : (
                    <>
                      {n.type === NotificationTypes.Comment && 'commented on'}
                      {n.type === NotificationTypes.Event &&
                        (sourceEvent?.type?.session
                          ? 'completed a'
                          : 'recorded')}{' '}
                      <span className="text-fg-2">
                        {sourceEvent?.type?.session?.mission?.name ??
                          sourceEvent?.type?.name}
                      </span>
                      {sourceEvent?.type?.session && (
                        <>
                          {' '}
                          session&nbsp;{sourceEvent.type.session.order + 1}
                          &nbsp;
                          {n.type === NotificationTypes.Comment ? (
                            <>
                              module&nbsp;{(sourceEvent.type?.order ?? 0) + 1}
                            </>
                          ) : (
                            'module'
                          )}
                        </>
                      )}
                    </>
                  )}
                </p>
                {n?.comment && (
                  <DirtyHtml className="text-fg-2">
                    {n?.comment.content}
                  </DirtyHtml>
                )}
              </div>
            </Button>
            <div className="absolute right-6 top-6 flex gap-6 sm:right-10">
              <form
                action={updateNotification.bind(null, {
                  archived: !n.archived,
                  id: n.id,
                })}
              >
                <IconButton
                  className="rounded-full hover:bg-alpha-1"
                  icon={
                    n.archived ? (
                      <ArchiveBoxXMarkIcon className="w-5" />
                    ) : (
                      <ArchiveBoxArrowDownIcon className="w-5" />
                    )
                  }
                  type="submit"
                />
              </form>
              <form action={deleteNotification.bind(null, n.id)}>
                <IconButton
                  className="rounded-full hover:bg-alpha-1"
                  icon={<TrashIcon className="w-5" />}
                  type="submit"
                />
              </form>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default Notifications;
