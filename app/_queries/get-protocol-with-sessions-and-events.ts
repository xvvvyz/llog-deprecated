import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getProtocolWithSessionsAndEvents = (
  protocolId: string,
  { draft } = { draft: false },
) =>
  createServerSupabaseClient()
    .from('protocols')
    .select(
      `
      id,
      name,
      sessions(
        draft,
        id,
        modules:event_types(
          event:events(created_at, id),
          id
        ),
        order,
        scheduled_for,
        title
      )`,
    )
    .eq('id', protocolId)
    .order('order', { referencedTable: 'sessions' })
    .not('sessions.draft', 'is', draft ? null : true)
    .order('draft', { ascending: false, referencedTable: 'sessions' })
    .eq('sessions.modules.archived', false)
    .single();

export type GetProtocolWithSessionsAndEventsData = Awaited<
  ReturnType<typeof getProtocolWithSessionsAndEvents>
>['data'];

export default getProtocolWithSessionsAndEvents;
