import createServerComponentClient from '@/_server/create-server-component-client';

const listNotifications = async () =>
  createServerComponentClient()
    .from('notifications')
    .select(
      `
      comment:comments(
        content,
        event:events(
          id,
          type:event_types(
            name,
            order,
            session:sessions(
              id,
              mission:missions(id, name),
              order
            )
          )
        )
      ),
      created_at,
      event:events(
        id,
        type:event_types(
          name,
          order,
          session:sessions(
            id,
            mission:missions(id, name),
            order
          )
        )
      ),
      id,
      profile:source_profile_id(first_name, last_name),
      read,
      subject:subjects(id, image_uri, name),
      type`,
    )
    .order('created_at', { ascending: false })
    .limit(50);

export type ListNotificationsData = Awaited<
  ReturnType<typeof listNotifications>
>['data'];

export default listNotifications;
