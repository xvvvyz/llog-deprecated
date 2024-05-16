import getCurrentUser from '@/_queries/get-current-user';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listSubjectsByTeamId = async () =>
  createServerSupabaseClient()
    .from('subjects')
    .select('id, image_uri, name, team_id')
    .eq('team_id', (await getCurrentUser())?.id ?? '')
    .eq('deleted', false)
    .order('name');

export type ListSubjectsByTeamIdData = Awaited<
  ReturnType<typeof listSubjectsByTeamId>
>['data'];

export default listSubjectsByTeamId;
