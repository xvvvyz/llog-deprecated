import createServerSupabaseClient from '(utilities)/create-server-supabase-client';

const getMission = (missionId: string) =>
  createServerSupabaseClient()
    .from('missions')
    .select('id, name, sessions(id)')
    .eq('id', missionId)
    .eq('sessions.deleted', false)
    .or(`scheduled_for.lte.${new Date().toISOString()},scheduled_for.is.null`, {
      foreignTable: 'sessions',
    })
    .order('order', { foreignTable: 'sessions' })
    .single();

export type GetMissionData = Awaited<ReturnType<typeof getMission>>['data'];
export default getMission;
