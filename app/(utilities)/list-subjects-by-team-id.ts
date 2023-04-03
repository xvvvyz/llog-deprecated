import createServerSupabaseClient from './create-server-supabase-client';
import getCurrentTeamId from './get-current-team-id';

const listSubjectsByTeamId = async () =>
  createServerSupabaseClient()
    .from('subjects')
    .select('id, image_uri, name, team_id')
    .eq('team_id', await getCurrentTeamId())
    .eq('deleted', false)
    .order('name');

export type ListSubjectsByTeamIdData = Awaited<
  ReturnType<typeof listSubjectsByTeamId>
>['data'];

export default listSubjectsByTeamId;
