import getCurrentUser from '@/_queries/get-current-user';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listSubjectsByTeamId = async () =>
  createServerSupabaseClient()
    .from('subjects')
    .select('archived, id, image_uri, name, team_id')
    .eq('team_id', (await getCurrentUser())?.id ?? '')
    .eq('deleted', false)
    .eq('archived', false)
    .order('name');

export type ListSubjectsByTeamIdData = Awaited<
  ReturnType<typeof listSubjectsByTeamId>
>['data'];

export default listSubjectsByTeamId;
