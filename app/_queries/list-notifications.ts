import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listNotifications = async () =>
  (await createServerSupabaseClient())
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
              protocol:protocols(id, name),
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
            protocol:protocols(id, name),
            order
          )
        )
      ),
      id,
      profile:source_profile_id(first_name, id, image_uri, last_name),
      subject:subjects(id, image_uri, name),
      type`,
    )
    .order('created_at', { ascending: false })
    .limit(50);

export type ListNotificationsData = Awaited<
  ReturnType<typeof listNotifications>
>['data'];

export default listNotifications;
