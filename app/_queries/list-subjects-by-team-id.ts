import getCurrentUser from '@/_queries/get-current-user';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listSubjectsByTeamId = async () =>
  (await createServerSupabaseClient())
    .from('subjects')
    .select('archived, id, image_uri, name, team_id')
    .eq('team_id', (await getCurrentUser())?.id ?? '')
    .eq('deleted', false)
    .not('archived', 'is', null)
    .order('name');

export type ListSubjectsByTeamIdData = Awaited<
  ReturnType<typeof listSubjectsByTeamId>
>['data'];

export default listSubjectsByTeamId;
