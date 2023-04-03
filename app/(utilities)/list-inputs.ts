import createServerSupabaseClient from './create-server-supabase-client';
import getCurrentTeamId from './get-current-team-id';

const listInputs = async () =>
  createServerSupabaseClient()
    .from('inputs')
    .select('id, label, subjects(id, image_uri, name), type')
    .eq('team_id', await getCurrentTeamId())
    .eq('deleted', false)
    .order('label');

export type ListInputsData = Awaited<ReturnType<typeof listInputs>>['data'];

export default listInputs;
