import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getProtocolWithSessions = async (
  protocolId: string,
  { draft } = { draft: false },
) =>
  (await createServerSupabaseClient())
    .from('protocols')
    .select('id, name, sessions(draft, id, order, scheduled_for, title)')
    .eq('id', protocolId)
    .order('order', { referencedTable: 'sessions' })
    .not('sessions.draft', 'is', draft ? null : true)
    .order('draft', { ascending: false, referencedTable: 'sessions' })
    .single();

export type GetProtocolWithSessionsData = Awaited<
  ReturnType<typeof getProtocolWithSessions>
>['data'];

export default getProtocolWithSessions;
