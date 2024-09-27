import Avatar from '@/_components/avatar';
import Button from '@/_components/button';
import DateTime from '@/_components/date-time';
import DirtyHtml from '@/_components/dirty-html';
import Empty from '@/_components/empty';
import IconButton from '@/_components/icon-button';
import NotificationType from '@/_constants/enum-notification-type';
import deleteNotification from '@/_mutations/delete-notification';
import { ListNotificationsData } from '@/_queries/list-notifications';
import { Database } from '@/_types/database';
import { SparklesIcon } from '@heroicons/react/24/outline';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';

interface NotificationsProps {
  notifications: ListNotificationsData;
}

const Notifications = ({ notifications }: NotificationsProps) => {
  if (!notifications?.length) {
    return (
      <Empty className="mx-4">
        <SparklesIcon className="w-7" />
        You&apos;re all caught up.
      </Empty>
    );
  }

  return (
    <ul className="mx-4 divide-y divide-alpha-1 overflow-hidden rounded border border-alpha-1 bg-bg-2 py-1">
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
                  ? `/subjects/${n?.subject?.id}/events/${sourceEvent.id}`
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
                  {n.type === NotificationType.JoinSubject ? (
                    <>joined {n?.subject?.name}</>
                  ) : (
                    <>
                      {n.type === NotificationType.Comment && 'commented on'}
                      {n.type === NotificationType.Event &&
                        (sourceEvent?.type?.session
                          ? 'completed a'
                          : 'recorded')}{' '}
                      <span className="text-fg-2">
                        {sourceEvent?.type?.session?.protocol?.name ??
                          sourceEvent?.type?.name}
                      </span>
                      {sourceEvent?.type?.session && (
                        <>
                          {' '}
                          session&nbsp;{sourceEvent.type.session.order + 1}
                          &nbsp;
                          {n.type === NotificationType.Comment ? (
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
            <form action={deleteNotification.bind(null, n.id)}>
              <IconButton
                className="absolute right-6 top-6 rounded-full hover:bg-alpha-1 sm:right-8"
                icon={<TrashIcon className="w-5" />}
                type="submit"
              />
            </form>
          </li>
        );
      })}
    </ul>
  );
};

export default Notifications;
