import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listNotifications = async ({ archived = false } = {}) =>
  createServerSupabaseClient()
    .from('notifications')
    .select(
      `
      archived,
      comment:comments(
        content,
        event:events(
          id,
          type:event_types(
            name,
            order,
            session:sessions(
              id,
              training_plan:training_plans(id, name),
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
            training_plan:training_plans(id, name),
            order
          )
        )
      ),
      id,
      profile:source_profile_id(first_name, id, image_uri, last_name),
      subject:subjects(id, image_uri, name),
      type`,
    )
    .eq('archived', archived)
    .order('created_at', { ascending: false })
    .limit(50);

export type ListNotificationsData = Awaited<
  ReturnType<typeof listNotifications>
>['data'];

export default listNotifications;
