import getCurrentUserFromSession from '@/_queries/get-current-user-from-session';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listSubjectsByTeamId = async () =>
  createServerSupabaseClient()
    .from('subjects')
    .select('id, image_uri, name, team_id')
    .eq('team_id', (await getCurrentUserFromSession())?.id ?? '')
    .eq('deleted', false)
    .order('name');

export type ListSubjectsByTeamIdData = Awaited<
  ReturnType<typeof listSubjectsByTeamId>
>['data'];

export default listSubjectsByTeamId;
