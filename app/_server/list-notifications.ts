import createServerComponentClient from './create-server-component-client';

const listNotifications = async () =>
  createServerComponentClient()
    .from('notifications')
    .select(
      `
      comment:comments(
        content,
        event:events(
          id,
          subject:subjects(id, image_uri, name),
          type:event_types(
            name,
            session:sessions(
              id,
              mission:missions(id, name)
            )
          )
        ),
        profile:profiles(first_name, last_name)
      ),
      created_at,
      event:events(
        id,
        profile:profiles(first_name, last_name),
        subject:subjects(id, image_uri, name),
        type:event_types(
          name,
          session:sessions(
            id,
            mission:missions(id, name)
          )
        )
      ),
      id,
      read,
      type`
    )
    .order('created_at', { ascending: false })
    .limit(50);

export type ListNotificationsData = Awaited<
  ReturnType<typeof listNotifications>
>['data'];

export default listNotifications;
