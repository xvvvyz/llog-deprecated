import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getMissionWithSessions = (
  missionId: string,
  { draft } = { draft: false },
) =>
  createServerSupabaseClient()
    .from('missions')
    .select('id, name, sessions(draft, id, order, scheduled_for, title)')
    .eq('id', missionId)
    .order('order', { referencedTable: 'sessions' })
    .not('sessions.draft', 'is', draft ? null : true)
    .order('draft', { ascending: false, referencedTable: 'sessions' })
    .single();

export type GetMissionWithSessionsData = Awaited<
  ReturnType<typeof getMissionWithSessions>
>['data'];

export default getMissionWithSessions;
