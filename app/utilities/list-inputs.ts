import createServerSupabaseClient from './create-server-supabase-client';
import getCurrentTeamId from './get-current-team-id';

const listInputs = async () =>
  createServerSupabaseClient()
    .from('inputs')
    .select('id, label, type')
    .eq('team_id', await getCurrentTeamId())
    .order('updated_at', { ascending: false });

export type ListInputsData = Awaited<ReturnType<typeof listInputs>>['data'];
export default listInputs;
